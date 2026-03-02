import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db, notifications, workspaces, eq, desc } from '@notifykit/db';
import { NotificationFeed } from '@/components/dashboard/NotificationFeed';
import type { NotificationRow } from '@/components/dashboard/NotificationFeed';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [workspace] = await (db as unknown as { select: Function })
    .select()
    .from(workspaces)
    .where(eq(workspaces.userId, session.user.id))
    .limit(1);

  const rows: NotificationRow[] = workspace
    ? (
        await (db as unknown as { select: Function })
          .select()
          .from(notifications)
          .where(eq(notifications.workspaceId, workspace.id))
          .orderBy(desc(notifications.createdAt))
          .limit(200)
      ).map(
        (n: {
          id: string;
          workspaceId: string;
          recipientId: string;
          title: string;
          body: string;
          category: string;
          actionUrl: string | null;
          isRead: boolean;
          createdAt: Date;
        }) => ({
          ...n,
          createdAt: n.createdAt.toISOString(),
        })
      )
    : [];

  return <NotificationFeed notifications={rows} />;
}
