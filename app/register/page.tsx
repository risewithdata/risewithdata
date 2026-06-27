'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function RegisterForm() {
  const params    = useSearchParams();
  const prefEmail = params.get('email') ?? '';
  const prefFirst = params.get('firstName') ?? '';
  const prefLast  = params.get('lastName') ?? '';

  const [firstName, setFirstName] = useState(prefFirst);
  const [lastName,  setLastName]  = useState(prefLast);
  const [email,     setEmail]     = useState(prefEmail);
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState(false);

  useEffect(() => {
    if (prefFirst) setFirstName(prefFirst);
    if (prefLast)  setLastName(prefLast);
    if (prefEmail) setEmail(prefEmail);
  }, [prefFirst, prefLast, prefEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), firstName: firstName.trim(), lastName: lastName.trim(), password }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? 'Registration failed.'); return; }
      setSuccess(true);
      setTimeout(() => { window.location.href = json.redirect ?? '/dashboard/student'; }, 1200);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Account created!</h2>
        <p className="text-sm text-slate-500">Redirecting you to your dashboard…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            autoComplete="given-name"
            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            autoComplete="family-name"
            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-300">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={!!prefEmail}
          placeholder="you@example.com"
          autoComplete="email"
          className={`w-full rounded-xl border px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
            prefEmail
              ? 'border-slate-700 bg-slate-900 cursor-not-allowed opacity-70'
              : 'border-slate-600 bg-slate-800'
          }`}
        />
        {prefEmail && (
          <p className="mt-1 text-xs text-slate-500">Email is tied to your approved application.</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-300">Password</label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
            {showPass
              ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            }
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-300">Confirm Password</label>
        <div className="relative">
          <input
            type={showConf ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter password"
            autoComplete="new-password"
            className={`w-full rounded-xl border bg-slate-800 px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 ${
              confirm && confirm !== password
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
          />
          <button type="button" onClick={() => setShowConf(!showConf)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
            {showConf
              ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            }
          </button>
        </div>
        {confirm && confirm !== password && (
          <p className="mt-1 text-xs text-red-400">Passwords do not match.</p>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (!!confirm && confirm !== password)}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating account…
          </span>
        ) : 'Create Account'}
      </button>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <a href="/login" className="font-semibold text-blue-400 hover:text-blue-300">Sign in</a>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <a href="/">
            <img src="/logo.svg" alt="RiseWithData" className="mx-auto h-12 w-auto brightness-0 invert" />
          </a>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20">
              <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Create Your Account</h1>
            <p className="mt-1 text-sm text-slate-400">
              Set up your student account to access your course.
            </p>
          </div>

          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-slate-800" />}>
            <RegisterForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} RiseWithData · For approved students only
        </p>
      </div>
    </div>
  );
}
