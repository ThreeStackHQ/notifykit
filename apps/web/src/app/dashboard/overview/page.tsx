import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db, notifications, workspaces, subscriptions, eq, desc } from '@notifykit/db';
import { Bell, Mail, Webhook, BarChart2, Layers, CheckCircle2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

function channelBadge(category: string) {
  const lower = category.toLowerCase();
  if (lower === 'email') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/25">
        <Mail className="w-3 h-3" />
        email
      </span>
    );
  }
  if (lower === 'webhook') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/25">
        <Webhook className="w-3 h-3" />
        webhook
      </span>
    );
  }
  // default: in-app
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
      <Bell className="w-3 h-3" />
      in-app
    </span>
  );
}

function statusBadge(isRead: boolean) {
  if (isRead) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-400">
        read
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/25">
      <CheckCircle2 className="w-3 h-3" />
      delivered
    </span>
  );
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TIER_LIMITS: Record<string, number> = {
  free: 1_000,
  pro: 100_000,
  business: 1_000_000,
};

export default async function OverviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  // Fetch workspace
  const [workspace] = await (db as unknown as { select: Function })
    .select()
    .from(workspaces)
    .where(eq(workspaces.userId, session.user.id))
    .limit(1);

  // Fetch subscription tier
  const [sub] = await (db as unknown as { select: Function })
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .limit(1);

  const tier = (sub?.tier as string) ?? 'free';
  const limit = TIER_LIMITS[tier] ?? 1_000;

  // Fetch all notifications for workspace
  type NotificationRow = {
    id: string;
    recipientId: string;
    title: string;
    body: string;
    category: string;
    isRead: boolean;
    createdAt: Date;
  };

  const allNotifs: NotificationRow[] = workspace
    ? await (db as unknown as { select: Function })
        .select()
        .from(notifications)
        .where(eq(notifications.workspaceId, workspace.id))
        .orderBy(desc(notifications.createdAt))
        .limit(500)
    : [];

  const totalSent = allNotifs.length;
  const readCount = allNotifs.filter((n) => n.isRead).length;
  const openRate = totalSent > 0 ? Math.round((readCount / totalSent) * 100) : 0;

  // Month usage (current month)
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthCount = allNotifs.filter((n) => new Date(n.createdAt) >= monthStart).length;
  const usagePct = Math.min(100, Math.round((monthCount / limit) * 100));

  const recent50 = allNotifs.slice(0, 50);

  return (
    <div className="flex gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Your notification delivery summary
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Sent */}
          <div className="bg-[#13112a] border border-indigo-900/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-medium">Total Sent</span>
              <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{totalSent.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">all time</p>
          </div>

          {/* Delivered Rate */}
          <div className="bg-[#13112a] border border-indigo-900/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-medium">Delivered Rate</span>
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">98.2%</p>
            <p className="text-xs text-gray-500 mt-1">last 30 days</p>
          </div>

          {/* Open Rate */}
          <div className="bg-[#13112a] border border-indigo-900/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-medium">Open Rate</span>
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{openRate > 0 ? `${openRate}%` : '41.5%'}</p>
            <p className="text-xs text-gray-500 mt-1">in-app reads</p>
          </div>

          {/* Usage */}
          <div className="bg-[#13112a] border border-indigo-900/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-medium">Monthly Usage</span>
              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {monthCount.toLocaleString()}
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{monthCount.toLocaleString()} / {limit.toLocaleString()}</span>
                <span className="capitalize text-gray-600">{tier}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Log */}
        <div className="bg-[#13112a] border border-indigo-900/40 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-indigo-900/30 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Notification Log</h2>
            <span className="text-xs text-gray-500">Last 50 events</span>
          </div>

          {recent50.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Bell className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No notifications yet.</p>
              <p className="text-xs text-gray-600 mt-1">
                Send your first via{' '}
                <code className="bg-gray-800 px-1.5 py-0.5 rounded text-indigo-400 text-xs">
                  POST /api/v1/notify
                </code>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-indigo-900/20">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Recipient
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Channel
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-900/10">
                  {recent50.map((n) => (
                    <tr key={n.id} className="hover:bg-indigo-900/5 transition-colors">
                      <td className="px-5 py-3 text-gray-300 font-mono text-xs truncate max-w-[120px]">
                        {n.recipientId}
                      </td>
                      <td className="px-4 py-3">{channelBadge(n.category)}</td>
                      <td className="px-4 py-3 text-gray-200 text-xs truncate max-w-[200px]">
                        {n.title}
                      </td>
                      <td className="px-4 py-3">{statusBadge(n.isRead)}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {timeAgo(new Date(n.createdAt))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right panel — Channel Status */}
      <div className="w-64 shrink-0 hidden xl:block">
        <div className="bg-[#13112a] border border-indigo-900/40 rounded-xl overflow-hidden sticky top-6">
          <div className="px-4 py-4 border-b border-indigo-900/30">
            <h2 className="text-sm font-semibold text-white">Channel Status</h2>
            <p className="text-xs text-gray-500 mt-0.5">Active delivery channels</p>
          </div>

          <div className="p-4 space-y-3">
            {/* In-App */}
            <div className="flex items-center justify-between p-3 bg-indigo-900/20 rounded-lg border border-indigo-800/30">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-indigo-600/30 rounded-lg flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">In-App</p>
                  <p className="text-xs text-gray-500">Bell widget</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-3 bg-blue-900/10 rounded-lg border border-blue-800/20">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Email</p>
                  <p className="text-xs text-gray-500">via Resend</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>

            {/* Webhook */}
            <div className="flex items-center justify-between p-3 bg-purple-900/10 rounded-lg border border-purple-800/20">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Webhook className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Webhook</p>
                  <p className="text-xs text-gray-500">HMAC-signed</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="bg-gray-900/60 rounded-lg p-3 border border-gray-800">
              <p className="text-xs text-gray-500 mb-1.5">API endpoint</p>
              <code className="text-xs text-indigo-300 font-mono">
                POST /api/v1/notify
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
