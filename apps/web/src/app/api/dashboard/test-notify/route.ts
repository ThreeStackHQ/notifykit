import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db, notifications, workspaces, eq } from '@notifykit/db';
import { publishToSubscribers } from '@/lib/sse-store';

export const dynamic = 'force-dynamic';

const schema = z.object({
  recipient_id: z.string().min(1).max(255).default('test_user'),
  title: z.string().min(1).max(500),
  body: z.string().min(1).max(5000),
  category: z.string().max(50).default('info'),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [workspace] = await (db as unknown as { select: Function })
    .select()
    .from(workspaces)
    .where(eq(workspaces.userId, session.user.id))
    .limit(1);

  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = schema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const { recipient_id, title, body, category } = parsed.data;

  const [notification] = await (db as unknown as { insert: Function })
    .insert(notifications)
    .values({
      workspaceId: workspace.id,
      recipientId: recipient_id,
      title,
      body,
      category,
      actionUrl: null,
    })
    .returning();

  publishToSubscribers(recipient_id, JSON.stringify(notification));

  return NextResponse.json(notification, { status: 201 });
}
