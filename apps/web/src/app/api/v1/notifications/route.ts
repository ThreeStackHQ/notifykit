import { NextResponse } from 'next/server';
import { db, notifications, eq, and, desc } from '@notifykit/db';
import { verifyApiKey } from '@/lib/api-key';
import { checkRateLimit } from '@/lib/rate-limiter';
import { handleOptions, withCors } from '@/lib/cors';

export { handleOptions as OPTIONS };

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const recipientId = searchParams.get('recipient_id');
  const rawKey = searchParams.get('api_key');

  if (!rawKey) {
    return NextResponse.json({ error: 'Missing api_key' }, { status: 401 });
  }
  if (!recipientId) {
    return NextResponse.json({ error: 'Missing recipient_id' }, { status: 400 });
  }

  const keyData = await verifyApiKey(rawKey);
  if (!keyData) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  // Per-key rate limiting (200 reads/hour by default; scales with rateLimitPerHour)
  const readLimit = Math.max(200, keyData.rateLimitPerHour * 2);
  if (!checkRateLimit(`list:${keyData.keyId}`, readLimit)) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  const rows = await (db as unknown as { select: Function })
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.workspaceId, keyData.workspaceId),
        eq(notifications.recipientId, recipientId)
      )
    )
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  return withCors(NextResponse.json(rows));
}
