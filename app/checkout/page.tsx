'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { NavigationBar } from '@features/home/components/NavigationBar.client';

const PLANS: Record<string, { price: string; amount: number; color: string }> = {
  Core:     { price: '$89',  amount: 89,  color: 'bg-blue-600' },
  Advanced: { price: '$139', amount: 139, color: 'bg-brand-600' },
  Elite:    { price: '$250', amount: 250, color: 'bg-slate-800' },
};

const EMPTY = { fullName: '', email: '', phone: '', city: '' };

function CheckoutForm() {
  const params     = useSearchParams();
  const router     = useRouter();
  const plan       = params.get('plan') ?? '';
  const planInfo   = PLANS[plan];

  const [form, setForm]     = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (!planInfo) router.replace('/pricing');
  }, [planInfo, router]);

  if (!planInfo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, courseName: plan }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? 'Failed to create checkout');
      window.location.href = j.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const field = (
    key: keyof typeof EMPTY,
    label: string,
    type = 'text',
    placeholder = ''
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        required
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );

  return (
    <>
      <NavigationBar />
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-lg px-6 py-14">

          {/* Plan badge */}
          <div className="mb-8 text-center">
            <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-bold text-white ${planInfo.color}`}>
              {plan} Plan — {planInfo.price}
            </span>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Complete your enrollment</h1>
            <p className="mt-2 text-sm text-slate-500">Enter your details below to proceed to secure payment</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {field('fullName', 'Full Name')}
              {field('email',    'Email Address', 'email')}
              {field('phone',    'Phone Number',  'tel')}
              {field('city',     'City / State')}

              {/* Order summary */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Course</span>
                  <span className="font-semibold text-slate-800">{plan} Plan</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Amount</span>
                  <span className="text-lg font-bold text-slate-900">{planInfo.price}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-60"
              >
                {loading ? 'Redirecting to Stripe…' : `Pay ${planInfo.price} securely →`}
              </button>

              <p className="text-center text-xs text-slate-400">
                Secured by Stripe · Your card details are never stored on our servers
              </p>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            <a href="/pricing" className="underline hover:text-slate-600">← Back to pricing</a>
          </p>
        </div>
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  );
}
