'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/dashboard/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const from = params.get('from') || '/dashboard';
      router.push(from);
    } else {
      setError('Wrong password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-sm px-8 py-10 rounded-2xl border border-white/10 bg-white/[0.03]">
        <p className="text-xs font-bold tracking-[4px] uppercase text-[#E1FF00] mb-6">TSC / Internal</p>
        <h1 className="text-2xl font-normal text-white mb-2">Dashboard</h1>
        <p className="text-sm text-[#d1d1c6] mb-8">Enter the access password to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6D6D69] focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-colors text-sm"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-[#E1FF00] text-[#0a0a0a] font-semibold rounded-lg hover:bg-white transition-colors disabled:opacity-40 text-sm"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
