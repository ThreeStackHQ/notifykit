import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, notifications, subscriptions, eq, sql } from '@notifykit/db';
import { verifyApiKey } from '@/lib/api-key';
import { checkRateLimit } from '@/lib/rate-limiter';
import { handleOptions, withCors } from '@/lib/cors';
import { publishToSubscribers, sseKey } from '@/lib/sse-store';
import { sendNotificationEmail } from '@/lib/email';
import { PLANS } from '@/lib/stripe';

export { handleOptions as OPTIONS };

export const dynamic = 'force-dynamic';

const notifySchema = z.object({
  recipient_id: z.string().min(1).max(255),
  title: z.string().min(1).max(500),
  body: z.string().min(1).max(5000),
  category: z.string().max(50).optional().default('info'),
  action_url: z.string().url().optional(),
  email_fallback: z.string().email().optional(),
});

export async function POST(req: Request) {
  const rawKey = req.headers.get('X-API-Key') ?? req.headers.get('x-api-key');
  if (!rawKey) {
    return NextResponse.json({ error: 'Missing X-API-Key header' }, { status: 401 });
  }

  const keyData = await verifyApiKey(rawKey);
  if (!keyData) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  // Per-key rate limiting (uses rateLimitPerHour stored on the API key row)
  const allowed = checkRateLimit(`notify:${keyData.keyId}`, keyData.rateLimitPerHour);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please slow down your requests.' },
      { status: 429 }
    );
  }

  // Tier limits
  const tierLimits: Record<string, number> = {
    free: PLANS.free.monthlyLimit,
    starter: PLANS.starter.monthlyLimit,
    pro: Infinity,
  };
  const limit = tierLimits[keyData.tier] ?? PLANS.free.monthlyLimit;
  if (limit !== Infinity && keyData.notificationsSentThisMonth >= limit) {
    return NextResponse.json(
      { error: 'Monthly notification limit reached. Upgrade your plan.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = notifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const { recipient_id, title, body: notifBody, category, action_url, email_fallback } = parsed.data;

  // Insert notification
  const [notification] = await (db as unknown as { insert: Function })
    .insert(notifications)
    .values({
      workspaceId: keyData.workspaceId,
      recipientId: recipient_id,
      title,
      body: notifBody,
      category,
      actionUrl: action_url ?? null,
    })
    .returning();

  // Atomic SQL increment — avoids race condition under concurrent requests
  await (db as unknown as { update: Function })
    .update(subscriptions)
    .set({
      notificationsSentThisMonth: sql`${subscriptions.notificationsSentThisMonth} + 1`,
    })
    .where(eq(subscriptions.userId, keyData.userId))
    .catch(() => {});

  // Publish to SSE — scoped by workspaceId to prevent cross-workspace leakage
  publishToSubscribers(sseKey(keyData.workspaceId, recipient_id), JSON.stringify(notification));

  // Email fallback
  if (email_fallback) {
    sendNotificationEmail({
      to: email_fallback,
      title,
      body: notifBody,
      actionUrl: action_url,
      category,
    }).catch(() => {});
  }

  return withCors(NextResponse.json(notification, { status: 201 }));
}
