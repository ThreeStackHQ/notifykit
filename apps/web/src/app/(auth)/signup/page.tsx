'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error ?? 'Something went wrong');
      setLoading(false);
      return;
    }

    // Auto sign-in
    const signInRes = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (signInRes?.error) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🔔</div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 mt-1">Start for free, no credit card required</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Min 8 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-400 hover:text-teal-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
