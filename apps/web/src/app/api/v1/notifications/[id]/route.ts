import { NextResponse } from 'next/server';
import { db, notifications, eq, and } from '@notifykit/db';
import { verifyApiKey } from '@/lib/api-key';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const rawKey =
    req.headers.get('X-API-Key') ??
    req.headers.get('x-api-key') ??
    searchParams.get('api_key');

  if (!rawKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
  }

  const keyData = await verifyApiKey(rawKey);
  if (!keyData) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const [deleted] = await (db as unknown as { delete: Function })
    .delete(notifications)
    .where(
      and(
        eq(notifications.id, params.id),
        eq(notifications.workspaceId, keyData.workspaceId)
      )
    )
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
