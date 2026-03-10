import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Bell,
  Zap,
  BarChart2,
  Code2,
  Check,
  X,
  ArrowRight,
  Mail,
  Globe,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'NotifyKit — One API. Every Channel.',
  description:
    'Send in-app, email, and webhook notifications from a single REST API. Drop-in bell widget included. No Novu pricing shock. From $9/mo.',
  openGraph: {
    title: 'NotifyKit — One API. Every Channel.',
    description:
      'Multi-channel user notification service for indie SaaS. Send in-app, email and webhook notifications from a single API.',
    type: 'website',
  },
};

const features = [
  {
    icon: Bell,
    title: 'In-App Widget',
    description:
      'Drop in a <script> tag and get a real-time notification bell with SSE push, unread badge, and mark-as-read — in minutes.',
  },
  {
    icon: Zap,
    title: 'Multi-Channel',
    description:
      'Email via Resend, HTTP webhooks, and in-app — all from a single POST /api/v1/notify call. No separate SDKs.',
  },
  {
    icon: BarChart2,
    title: 'Delivery Analytics',
    description:
      'Track delivered rate, open rate, and channel-level breakdown. Know exactly how your notifications are performing.',
  },
  {
    icon: Code2,
    title: 'REST API',
    description:
      'OpenAPI spec, JS/TS SDK, and HMAC-signed webhooks. Works with Node, Python, Rails — any stack that speaks HTTP.',
  },
];

const comparison = [
  {
    feature: 'In-App Widget',
    notifykit: true,
    novu: true,
    onesignal: false,
    magicbell: true,
  },
  {
    feature: 'Email delivery',
    notifykit: true,
    novu: true,
    onesignal: true,
    magicbell: false,
  },
  {
    feature: 'Webhooks',
    notifykit: true,
    novu: true,
    onesignal: false,
    magicbell: true,
  },
  {
    feature: 'Dashboard',
    notifykit: true,
    novu: true,
    onesignal: true,
    magicbell: true,
  },
  {
    feature: 'Analytics',
    notifykit: true,
    novu: false,
    onesignal: true,
    magicbell: false,
  },
  {
    feature: 'Price / mo',
    notifykit: '$9',
    novu: '$249+',
    onesignal: '$99+',
    magicbell: '$99+',
  },
];

const pricing = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for side projects and prototypes.',
    cta: 'Start for free',
    ctaHref: '/signup',
    highlighted: false,
    features: [
      '1,000 notifications / mo',
      '1 channel (in-app)',
      'Bell widget',
      'REST API access',
      'Community support',
    ],
    missing: ['Email delivery', 'Webhooks', 'Analytics', 'Custom branding'],
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For growing products that need reliability.',
    cta: 'Get started',
    ctaHref: '/signup?plan=pro',
    highlighted: true,
    features: [
      '100,000 notifications / mo',
      'All channels (in-app + email + webhook)',
      'Delivery analytics',
      'HMAC-signed webhooks',
      'Email support',
      'API rate limit 10k/hr',
    ],
    missing: ['Custom domain widget', 'SLA', 'Priority support'],
  },
  {
    name: 'Business',
    price: '$29',
    period: '/month',
    description: 'For teams that need scale and reliability guarantees.',
    cta: 'Get started',
    ctaHref: '/signup?plan=business',
    highlighted: false,
    features: [
      '1,000,000 notifications / mo',
      'All channels',
      'Advanced analytics',
      'Custom domain widget',
      'Priority support',
      '99.9% uptime SLA',
      'API rate limit 100k/hr',
    ],
    missing: [],
  },
];

const codeSnippet = `const notifykit = new NotifyKit('nk_live_••••••••')

await notifykit.send({
  userId: 'usr_123',
  channels: ['in-app', 'email'],
  title: 'Your export is ready',
  body: 'Download your CSV report now.',
  actionUrl: '/reports/download',
})

// Response
// { id: 'ntf_abc123', delivered: ['in-app', 'email'] }`;

const mockNotifications = [
  { title: 'New comment on your post', time: '2m ago', unread: true, icon: '💬' },
  { title: 'Deployment succeeded', time: '14m ago', unread: true, icon: '🚀' },
  { title: 'Payment received · $49.00', time: '1h ago', unread: false, icon: '💳' },
  { title: 'Invite accepted by alex@acme.com', time: '3h ago', unread: false, icon: '👥' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0e1a] text-white">
      {/* Sticky Nav */}
      <header className="sticky top-0 z-40 bg-[#0f0e1a]/90 backdrop-blur-md border-b border-indigo-900/30">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">NotifyKit</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:inline-flex text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              Multi-channel notifications · Novu at 1/30th the price
            </div>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              One API.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                Every Channel.
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mb-8 leading-relaxed">
              Send in-app, email, and webhook notifications from a single REST API. Drop-in
              bell widget included. No Novu pricing shock.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#docs"
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                <Code2 className="w-4 h-4" />
                View docs
              </a>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Free tier · No credit card required · 1,000 notifications/mo
            </p>
          </div>

          {/* Right — Notification widget mockup */}
          <div className="flex-shrink-0 relative">
            <div className="w-72 bg-[#13112a] border border-indigo-800/40 rounded-2xl shadow-2xl shadow-indigo-900/40 overflow-hidden">
              {/* Widget header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-indigo-900/30 bg-[#1e1b4b]/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-white">Notifications</span>
                </div>
                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  2
                </span>
              </div>
              {/* Notification list */}
              <div className="divide-y divide-indigo-900/20">
                {mockNotifications.map((n, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 px-4 py-3.5 ${
                      n.unread ? 'bg-indigo-900/10' : ''
                    }`}
                  >
                    <span className="text-lg leading-none mt-0.5">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          n.unread ? 'text-white font-medium' : 'text-gray-400'
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && (
                      <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-indigo-900/20">
                <button className="w-full text-xs text-indigo-400 hover:text-indigo-300 transition-colors text-center">
                  Mark all as read
                </button>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg shadow-indigo-900/60 border-2 border-[#0f0e1a]">
              <Bell className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Everything your notifications need
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            One integration, four channels. Ship it in an afternoon.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#13112a] border border-indigo-900/30 rounded-2xl p-5 hover:border-indigo-700/50 transition-colors"
            >
              <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code snippet */}
      <section id="docs" className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-[#13112a] border border-indigo-900/30 rounded-2xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium mb-4">
                <Code2 className="w-3 h-3" />
                Simple API
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Send to all channels in one call
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                No separate SDKs. No webhook setup per-channel. One API key, one endpoint,
                every channel at once.
              </p>
              <ul className="space-y-2.5">
                {[
                  'JS/TS, Python, Ruby SDKs',
                  'HMAC-signed webhook payloads',
                  'OpenAPI 3.0 spec available',
                  'Idempotent with notification IDs',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full">
              <pre className="bg-[#0a0918] rounded-xl p-5 text-xs text-indigo-200 font-mono overflow-x-auto leading-relaxed border border-indigo-900/40">
                {codeSnippet}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Why not just use Novu?</h2>
          <p className="text-gray-400">
            Novu costs $249+/mo. NotifyKit gives you the same core features for $9.
          </p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-indigo-900/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#13112a] border-b border-indigo-900/30">
                <th className="px-6 py-4 text-left text-gray-400 font-medium">Feature</th>
                <th className="px-6 py-4 text-center text-indigo-400 font-semibold">NotifyKit</th>
                <th className="px-6 py-4 text-center text-gray-500 font-medium">Novu</th>
                <th className="px-6 py-4 text-center text-gray-500 font-medium">OneSignal</th>
                <th className="px-6 py-4 text-center text-gray-500 font-medium">MagicBell</th>
              </tr>
            </thead>
            <tbody className="bg-[#0f0e1a]">
              {comparison.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-indigo-900/15 ${
                    i % 2 === 0 ? '' : 'bg-indigo-900/5'
                  }`}
                >
                  <td className="px-6 py-4 text-gray-300 font-medium">{row.feature}</td>
                  <td className="px-6 py-4 text-center">
                    {typeof row.notifykit === 'boolean' ? (
                      row.notifykit ? (
                        <Check className="w-4 h-4 text-indigo-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-700 mx-auto" />
                      )
                    ) : (
                      <span className="font-bold text-indigo-400">{row.notifykit}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof row.novu === 'boolean' ? (
                      row.novu ? (
                        <Check className="w-4 h-4 text-gray-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-700 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-500">{row.novu}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof row.onesignal === 'boolean' ? (
                      row.onesignal ? (
                        <Check className="w-4 h-4 text-gray-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-700 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-500">{row.onesignal}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof row.magicbell === 'boolean' ? (
                      row.magicbell ? (
                        <Check className="w-4 h-4 text-gray-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-700 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-500">{row.magicbell}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Simple, honest pricing</h2>
          <p className="text-gray-400">
            No seat fees. No usage surprises. Pay for notifications, not users.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? 'bg-indigo-600 border-2 border-indigo-400 relative'
                  : 'bg-[#13112a] border border-indigo-900/30'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-5">
                <h3
                  className={`font-bold text-lg mb-1 ${
                    plan.highlighted ? 'text-white' : 'text-gray-200'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.highlighted ? 'text-indigo-200' : 'text-gray-400'
                  }`}
                >
                  {plan.description}
                </p>
              </div>
              <div className="mb-6">
                <span
                  className={`text-4xl font-extrabold ${
                    plan.highlighted ? 'text-white' : 'text-white'
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.highlighted ? 'text-indigo-200' : 'text-gray-500'
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-indigo-200' : 'text-indigo-400'
                      }`}
                    />
                    <span
                      className={plan.highlighted ? 'text-indigo-100' : 'text-gray-300'}
                    >
                      {f}
                    </span>
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <X
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-indigo-400' : 'text-gray-700'
                      }`}
                    />
                    <span
                      className={plan.highlighted ? 'text-indigo-300' : 'text-gray-600'}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-600 mt-6">
          All plans include SSL, 99.9% uptime SLA, and REST API access.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-indigo-900/20 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Bell className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-white">NotifyKit</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="/docs" className="hover:text-gray-300 transition-colors">Docs</a>
            <a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-gray-300 transition-colors">Terms</a>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              <span>threestack.io</span>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            © 2026 NotifyKit · ThreeStack
          </p>
        </div>
      </footer>
    </div>
  );
}
