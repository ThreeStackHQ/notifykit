import { NextResponse } from 'next/server';
import { db, notifications, eq, and } from '@notifykit/db';
import { verifyApiKey } from '@/lib/api-key';
import { handleOptions, withCors } from '@/lib/cors';

export { handleOptions as OPTIONS };
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
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

  await (db as unknown as { update: Function })
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.workspaceId, keyData.workspaceId),
        eq(notifications.recipientId, recipientId)
      )
    );

  return withCors(NextResponse.json({ success: true }));
}
