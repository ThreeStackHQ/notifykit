import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          🔔 NotifyKit
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          In-app notifications for indie SaaS
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          Drop-in notification center with real-time SSE, email fallback, and a &lt;5KB vanilla JS widget. 
          Knock.app at 1/10th the price.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Sign in
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-8 text-left">
          {[
            { title: 'Real-time SSE', desc: 'Instant notifications via Server-Sent Events — no WebSocket overhead.' },
            { title: 'Email fallback', desc: 'Automatically send email when users are offline, via Resend.' },
            { title: 'Vanilla JS widget', desc: '<5KB IIFE — drop in one script tag, works everywhere.' },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 rounded-xl p-6">
              <h3 className="font-semibold text-teal-400 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
