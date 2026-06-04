 'use client';
import { useState, type FormEvent } from 'react';
import { Button } from '@shared/ui/Button';

export function FinalCta() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus('success');
    setEmail('');
  };

  return (
    <section id="final-cta" className="rounded-[3rem] bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-16 text-white shadow-2xl shadow-violet-500/25 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">Ready to level up?</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Join the next cohort and accelerate your product career.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-cyan-100">Get tailored guidance, hands-on experience, and peer support to make your next move with confidence.</p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] bg-white/10 p-6 backdrop-blur-xl sm:p-8">
              <label className="block text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Joining...' : 'Reserve my spot'}
              </Button>
              {status === 'success' ? <p className="text-sm text-cyan-100">Thanks! You’ll hear from us soon.</p> : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
