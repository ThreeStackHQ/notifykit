import Link from 'next/link';
import {
  Bell,
  Zap,
  Shield,
  Code2,
  Radio,
  BarChart2,
  Tag,
  Mail,
  Check,
  X,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[#0f1117]/90 backdrop-blur-sm border-b border-gray-800">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">NotifyKit</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#integration" className="hover:text-white transition-colors">Docs</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Get started free
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, #0f766e 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            50ms delivery · No WebSocket overhead
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
            In-App Notifications{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              That Actually Convert
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Drop-in notification center for indie SaaS. Real-time SSE stream, email fallback,
            and a &lt;5KB vanilla JS widget. Knock.app at 1/10th the price.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#integration"
              className="flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              View docs
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Bell widget mockup */}
          <div className="max-w-sm mx-auto bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-sm text-white">Notifications</span>
              </div>
              <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
            </div>
            {[
              { title: 'Export ready', body: 'Your CSV export is ready to download.', cat: 'success', time: '2m ago' },
              { title: 'Payment received', body: 'Invoice #1042 has been paid.', cat: 'info', time: '1h ago' },
              { title: 'New comment', body: 'Alice left a comment on your post.', cat: 'info', time: '3h ago' },
            ].map((n) => (
              <div key={n.title} className="flex gap-3 py-2.5 border-b border-gray-800 last:border-0">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                    n.cat === 'success' ? 'bg-green-400' : 'bg-teal-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{n.title}</p>
                  <p className="text-xs text-gray-400 truncate">{n.body}</p>
                </div>
                <span className="text-xs text-gray-600 shrink-0">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50ms', label: 'Avg delivery time' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '<5KB', label: 'Widget size' },
            { value: '$9/mo', label: 'vs Knock $100+' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-teal-400 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3-step integration */}
      <section id="integration" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Integrate in minutes</h2>
          <p className="text-gray-400 text-lg">Three steps and you&apos;re live.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              title: 'Install the widget',
              code: 'npm install @notifykit/widget',
              description: 'Add the NotifyKit widget to your frontend in one line.',
            },
            {
              step: '2',
              title: 'Initialize',
              code: `NotifyKit.init({
  apiKey: 'nk_live_...',
  userId: user.id,
})`,
              description: 'Initialize with your API key and user ID. Works everywhere.',
            },
            {
              step: '3',
              title: 'Send notifications',
              code: `fetch('/api/v1/notify', {
  method: 'POST',
  headers: {
    'X-API-Key': 'nk_live_...'
  },
  body: JSON.stringify({
    recipient_id: 'user_123',
    title: 'Hello!',
    body: 'Your export is ready.'
  })
})`,
              description: 'Send notifications from your backend with a simple REST call.',
            },
          ].map((step) => (
            <div
              key={step.step}
              className="bg-gray-900 rounded-2xl p-5 border border-gray-800"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">{step.step}</span>
                </div>
                <h3 className="font-semibold text-white">{step.title}</h3>
              </div>
              <pre className="bg-gray-800 rounded-xl p-4 text-xs text-teal-300 font-mono overflow-x-auto mb-3 leading-relaxed">
                <code>{step.code}</code>
              </pre>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need</h2>
            <p className="text-gray-400 text-lg">
              Production-ready notification infrastructure for indie SaaS.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Bell,
                title: 'Bell Widget',
                desc: 'Drop-in &lt;5KB vanilla JS bell icon with unread badge, notification list, and mark-as-read. Works on any stack.',
              },
              {
                icon: Code2,
                title: 'REST API',
                desc: 'Simple HTTP API to send notifications from any backend. Rate-limited per key with tiered plans.',
              },
              {
                icon: Radio,
                title: 'SSE Real-time',
                desc: 'Server-Sent Events stream for instant delivery. No WebSocket complexity, works through proxies.',
              },
              {
                icon: BarChart2,
                title: 'Delivery Tracking',
                desc: 'Track notification reads, delivery rates, and active recipients from your dashboard.',
              },
              {
                icon: Tag,
                title: 'Multiple Categories',
                desc: 'Organize notifications by category: info, success, warning, error. Customizable per workspace.',
              },
              {
                icon: Mail,
                title: 'Email Fallback',
                desc: 'Automatically send email via Resend when users are offline. Never miss a critical notification.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-teal-800 transition-colors"
              >
                <div className="w-10 h-10 bg-teal-900/40 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p
                  className="text-sm text-gray-400 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: f.desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing comparison */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Honest pricing</h2>
          <p className="text-gray-400 text-lg">Stop paying enterprise prices for indie features.</p>
        </div>

        {/* Comparison table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Feature</th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-white">NotifyKit</span>
                      <span className="text-teal-400 font-bold text-lg">$9/mo</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-gray-300">Knock</span>
                      <span className="text-gray-400 text-lg">$100+/mo</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-gray-300">Novu</span>
                      <span className="text-gray-400 text-lg">$49+/mo</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ['Bell widget', true, true, true],
                  ['REST API', true, true, true],
                  ['SSE Real-time', true, false, true],
                  ['Email fallback', true, true, true],
                  ['Self-hostable', true, false, true],
                  ['Open source widget', true, false, false],
                  ['Indie pricing', true, false, false],
                  ['10K notifs/mo @ $9', true, false, false],
                ].map(([feature, nk, knock, novu]) => (
                  <tr key={String(feature)} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3.5 text-sm text-gray-300">{String(feature)}</td>
                    <td className="px-6 py-3.5 text-center">
                      {nk ? (
                        <Check className="w-5 h-5 text-teal-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-700 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {knock ? (
                        <Check className="w-5 h-5 text-gray-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-700 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {novu ? (
                        <Check className="w-5 h-5 text-gray-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-700 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              name: 'Free',
              price: '$0',
              period: '',
              desc: 'For side projects',
              limit: '500 notifications/mo',
              features: ['500 notifications/month', 'REST API', 'SSE stream', 'Bell widget'],
              cta: 'Get started',
              href: '/signup',
              highlight: false,
            },
            {
              name: 'Starter',
              price: '$9',
              period: '/mo',
              desc: 'For indie SaaS',
              limit: '10,000 notifications/mo',
              features: [
                '10,000 notifications/month',
                'REST API',
                'SSE stream',
                'Bell widget',
                'Email fallback',
                'Dashboard analytics',
              ],
              cta: 'Start for $9/mo',
              href: '/signup?plan=starter',
              highlight: true,
            },
            {
              name: 'Pro',
              price: '$29',
              period: '/mo',
              desc: 'For growing teams',
              limit: 'Unlimited notifications',
              features: [
                'Unlimited notifications',
                'REST API',
                'SSE stream',
                'Bell widget',
                'Email fallback',
                'Advanced analytics',
                'Custom categories',
                'Priority support',
              ],
              cta: 'Go Pro',
              href: '/signup?plan=pro',
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border ${
                plan.highlight
                  ? 'border-teal-600 bg-teal-900/10 relative'
                  : 'border-gray-800 bg-gray-900'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <p className="text-sm text-gray-400 mb-1">{plan.desc}</p>
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-0.5 mb-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <p className="text-xs text-gray-500 mb-5">{plan.limit}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-teal-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block w-full text-center font-semibold py-2.5 rounded-xl text-sm transition-colors ${
                  plan.highlight
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Loved by indie builders
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  'We replaced Knock.app with NotifyKit and saved $90/mo on day one. Setup took 20 minutes.',
                author: 'Marcus T.',
                role: 'Founder, FormFlow',
              },
              {
                quote:
                  'The SSE stream is rock solid. Real-time delivery with zero WebSocket headaches. Finally.',
                author: 'Priya S.',
                role: 'CTO, ShipFast',
              },
              {
                quote:
                  'The vanilla JS widget drops into any stack. We added it to our Rails app in one script tag.',
                author: 'Jake M.',
                role: 'Indie Hacker',
              },
            ].map((t) => (
              <div
                key={t.author}
                className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-teal-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.author}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div
          className="rounded-3xl p-10 border border-teal-900/50"
          style={{
            background: 'radial-gradient(ellipse at center, #0f766e18 0%, transparent 70%)',
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Start sending notifications today
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Free forever for hobby projects. Upgrade when you grow.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">NotifyKit</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} NotifyKit · Built by ThreeStack
          </p>
          <div className="flex gap-5 text-sm text-gray-500">
            <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign up</Link>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
