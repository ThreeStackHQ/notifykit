import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, apiKeys, workspaces, subscriptions, eq } from '@notifykit/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [workspace] = await (db as unknown as { select: Function })
    .select()
    .from(workspaces)
    .where(eq(workspaces.userId, session.user.id))
    .limit(1);

  const keys = workspace
    ? await (db as unknown as { select: Function })
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.workspaceId, workspace.id))
    : [];

  const [sub] = await (db as unknown as { select: Function })
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .limit(1);

  const tier = sub?.tier ?? 'free';
  const used = sub?.notificationsSentThisMonth ?? 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔔</span>
          <span className="font-bold text-lg">NotifyKit</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{session.user.email}</span>
          <Link href="/api/auth/signout" className="text-sm text-gray-400 hover:text-white">
            Sign out
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Plan status */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Current Plan</p>
              <p className="text-2xl font-bold capitalize text-teal-400">{tier}</p>
              <p className="text-sm text-gray-400 mt-1">
                {used.toLocaleString()} notifications sent this month
              </p>
            </div>
            {tier === 'free' && (
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="tier" value="starter" />
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  Upgrade to Starter — $9/mo
                </button>
              </form>
            )}
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">API Keys</h2>
          </div>

          {keys.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No API keys yet. Create one to start sending notifications.
            </p>
          ) : (
            <div className="space-y-3">
              {(keys as Array<{ id: string; name: string; keyPrefix: string; isActive: boolean; createdAt: Date }>).map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-sm">{key.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {key.keyPrefix}...
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        key.isActive
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {key.isActive ? 'Active' : 'Revoked'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300 font-medium mb-2">Quick start</p>
            <pre className="text-xs text-teal-300 overflow-x-auto">{`curl -X POST https://notifykit.threestack.io/api/v1/notify \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"recipient_id":"user_123","title":"Hello!","body":"Your export is ready."}'`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
