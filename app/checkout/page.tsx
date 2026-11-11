'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { NavigationBar } from '@features/home/components/NavigationBar.client';

const PLANS: Record<string, { price: string; amount: number; color: string }> = {
  Core:     { price: '$89',  amount: 89,  color: 'bg-blue-600' },
  Advanced: { price: '$139', amount: 139, color: 'bg-brand-600' },
  Elite:    { price: '$179', amount: 250, color: 'bg-slate-800' },
};

const EMPTY = { fullName: '', email: '', phone: '', zipcode: '' };
const EMPTY_ERRORS = { fullName: '', email: '', phone: '', zipcode: '' };

function validateField(key: keyof typeof EMPTY, value: string): string {
  const v = value.trim();
  if (key === 'fullName') {
    if (!v) return 'Full name is required';
    if (v.length < 2) return 'Enter your full name';
  }
  if (key === 'email') {
    if (!v) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address';
  }
  if (key === 'phone') {
    if (!v) return 'Phone number is required';
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) return 'Enter a valid 10-digit phone number';
  }
  if (key === 'zipcode') {
    if (!v) return 'Zipcode is required';
    if (!/^\d{5}(-\d{4})?$/.test(v)) return 'Enter a valid US zipcode (e.g. 90210)';
  }
  return '';
}


function CheckoutForm() {
  const params     = useSearchParams();
  const router     = useRouter();
  const plan       = params.get('plan') ?? '';
  const planInfo   = PLANS[plan];

  const [form, setForm]             = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState(EMPTY_ERRORS);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [couponInput, setCouponInput]         = useState('');
  const [couponStatus, setCouponStatus]       = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [couponMsg, setCouponMsg]             = useState('');
  const [appliedCoupon, setAppliedCoupon]     = useState<{ code: string; discountPercent: number } | null>(null);
  const couponAppliedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!planInfo) router.replace('/pricing');
  }, [planInfo, router]);

  if (!planInfo) return null;

  const discountedAmount = appliedCoupon
    ? Math.max(100, Math.round(planInfo.amount * 100 * (1 - appliedCoupon.discountPercent / 100)))
    : planInfo.amount * 100;
  const discountedPrice = appliedCoupon
    ? `$${(discountedAmount / 100).toFixed(2)}`
    : planInfo.price;

  const handleApplyCoupon = async () => {
    const trimmed = couponInput.trim();
    if (!trimmed) { setCouponMsg('Please enter a coupon code'); setCouponStatus('invalid'); return; }
    // If same code already applied, no need to re-validate
    if (couponAppliedRef.current === trimmed.toUpperCase()) return;
    setCouponStatus('validating');
    setCouponMsg('');
    try {
      const res = await fetch('/api/payments/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const j = await res.json();
      if (j.valid) {
        setAppliedCoupon({ code: j.code, discountPercent: j.discountPercent });
        couponAppliedRef.current = j.code;
        setCouponStatus('valid');
        setCouponMsg(`${j.discountPercent}% discount applied!`);
      } else {
        setAppliedCoupon(null);
        couponAppliedRef.current = null;
        setCouponStatus('invalid');
        setCouponMsg(j.message ?? 'Invalid coupon code');
      }
    } catch {
      setCouponStatus('invalid');
      setCouponMsg('Could not validate coupon. Please try again.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    couponAppliedRef.current = null;
    setCouponInput('');
    setCouponStatus('idle');
    setCouponMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields
    const errors = {
      fullName: validateField('fullName', form.fullName),
      email:    validateField('email',    form.email),
      phone:    validateField('phone',    form.phone),
      zipcode:  validateField('zipcode',  form.zipcode),
    };
    setFieldErrors(errors);
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;
    if (!termsAccepted) { setTermsError(true); return; }
    setTermsError(false);
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, courseName: plan, couponCode: appliedCoupon?.code ?? null }),
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
  ) => {
    const err = fieldErrors[key];
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => {
            setForm(f => ({ ...f, [key]: e.target.value }));
            if (fieldErrors[key]) setFieldErrors(fe => ({ ...fe, [key]: validateField(key, e.target.value) }));
          }}
          onBlur={e => setFieldErrors(fe => ({ ...fe, [key]: validateField(key, e.target.value) }))}
          className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 transition ${
            err ? 'border-red-400 bg-red-50 focus:ring-red-100' : 'border-slate-200 bg-white focus:border-brand-400 focus:ring-brand-100'
          }`}
        />
        {err && <p className="mt-1.5 text-xs text-red-600">{err}</p>}
      </div>
    );
  };

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
              {field('zipcode',  'Zipcode', 'text', 'e.g. 90210')}

              {/* Coupon code */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Coupon Code <span className="text-slate-400 font-normal">(optional)</span></label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                    <span className="text-sm font-semibold text-green-700">{couponMsg}</span>
                    <button type="button" onClick={handleRemoveCoupon} className="text-xs text-slate-400 hover:text-slate-600 underline ml-4">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value); setCouponStatus('idle'); setCouponMsg(''); }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                      placeholder="Enter coupon code"
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-brand-100 ${couponStatus === 'invalid' ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white focus:border-brand-400'}`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponStatus === 'validating'}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition"
                    >
                      {couponStatus === 'validating' ? 'Checking…' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponStatus === 'invalid' && couponMsg && (
                  <p className="mt-1.5 text-xs text-red-600">{couponMsg}</p>
                )}
              </div>

              {/* Order summary */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Course</span>
                  <span className="font-semibold text-slate-800">{plan} Plan</span>
                </div>
                {appliedCoupon && (
                  <div className="mt-1.5 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Discount</span>
                    <span className="font-semibold text-green-600">−{appliedCoupon.discountPercent}%</span>
                  </div>
                )}
                <div className="mt-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Amount</span>
                  <span className="flex items-baseline gap-2">
                    {appliedCoupon && (
                      <span className="text-sm text-slate-400 line-through">{planInfo.price}</span>
                    )}
                    <span className="text-lg font-bold text-slate-900">{discountedPrice}</span>
                  </span>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => { setTermsAccepted(e.target.checked); if (e.target.checked) setTermsError(false); }}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-sm text-slate-600">
                    I have read and agree to the{' '}
                    <a href="/terms" target="_blank" className="font-medium text-slate-900 underline hover:text-brand-600">
                      Terms &amp; Conditions
                    </a>
                    <span className="text-red-500"> *</span>
                  </span>
                </label>
                {termsError && (
                  <p className="mt-1.5 text-xs text-red-600">You must accept the Terms &amp; Conditions to proceed</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-60"
              >
                {loading ? 'Redirecting to Stripe…' : `Pay ${discountedPrice} securely →`}
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
