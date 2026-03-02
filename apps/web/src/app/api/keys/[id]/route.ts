import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, apiKeys, workspaces, eq, and } from '@notifykit/db';

export const dynamic = 'force-dynamic';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
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

  const [updated] = await (db as unknown as { update: Function })
    .update(apiKeys)
    .set({ isActive: false })
    .where(
      and(
        eq(apiKeys.id, params.id),
        eq(apiKeys.workspaceId, workspace.id)
      )
    )
    .returning();

  if (!updated) {
    return NextResponse.json({ error: 'API key not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
