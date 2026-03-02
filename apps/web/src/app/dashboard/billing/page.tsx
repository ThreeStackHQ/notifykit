import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, subscriptions, eq } from '@notifykit/db';
import { CreditCard, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [sub] = await (db as unknown as { select: Function })
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .limit(1);

  const tier = sub?.tier ?? 'free';
  const used = sub?.notificationsSentThisMonth ?? 0;

  const plans = [
    {
      name: 'Free',
      price: '$0',
      limit: '500 notifications/mo',
      features: ['500 notifications/month', 'SSE real-time stream', 'REST API', 'Bell widget'],
      current: tier === 'free',
      tier: 'free',
    },
    {
      name: 'Starter',
      price: '$9',
      limit: '10,000 notifications/mo',
      features: [
        '10,000 notifications/month',
        'SSE real-time stream',
        'REST API',
        'Bell widget',
        'Email fallback',
        'Priority support',
      ],
      current: tier === 'starter',
      tier: 'starter',
      highlight: true,
    },
    {
      name: 'Pro',
      price: '$29',
      limit: 'Unlimited notifications',
      features: [
        'Unlimited notifications',
        'SSE real-time stream',
        'REST API',
        'Bell widget',
        'Email fallback',
        'Priority support',
        'Custom categories',
        'Advanced analytics',
      ],
      current: tier === 'pro',
      tier: 'pro',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your subscription and usage</p>
      </div>

      {/* Current Usage */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-teal-900/40 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Current Plan</p>
            <p className="font-semibold text-white capitalize">{tier}</p>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <span className="text-white font-medium">{used.toLocaleString()}</span> notifications sent
          this month
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            className={`rounded-xl p-5 border ${
              plan.highlight
                ? 'border-teal-600 bg-teal-900/10'
                : 'border-gray-800 bg-gray-900'
            }`}
          >
            {plan.highlight && (
              <span className="inline-block bg-teal-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                Popular
              </span>
            )}
            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mt-1 mb-1">
              <span className="text-3xl font-bold text-white">{plan.price}</span>
              {plan.price !== '$0' && <span className="text-gray-400 text-sm">/mo</span>}
            </div>
            <p className="text-xs text-gray-500 mb-4">{plan.limit}</p>

            <ul className="space-y-2 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {plan.current ? (
              <div className="w-full text-center bg-gray-800 text-gray-400 font-medium py-2 rounded-lg text-sm">
                Current Plan
              </div>
            ) : tier === 'free' || (tier === 'starter' && plan.tier === 'pro') ? (
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="tier" value={plan.tier} />
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
                >
                  Upgrade to {plan.name}
                </button>
              </form>
            ) : (
              <div className="w-full text-center text-gray-600 text-sm py-2">
                —
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
