'use client';

import { useEffect, useRef, useState } from 'react';

type Stage = 'idle' | 'open' | 'sending' | 'success';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SupportWidget() {
  const [stage,   setStage]   = useState<Stage>('idle');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [sendErr,  setSendErr]  = useState('');
  const backdropRef = useRef<HTMLDivElement>(null);
  const emailRef    = useRef<HTMLInputElement>(null);

  const canSend = email.trim() !== '' && message.trim() !== '';

  // Focus email field when modal opens
  useEffect(() => {
    if (stage === 'open') {
      setTimeout(() => emailRef.current?.focus(), 50);
    }
  }, [stage]);

  // Auto-close after success
  useEffect(() => {
    if (stage !== 'success') return;
    const t = setTimeout(() => {
      setStage('idle');
      setEmail('');
      setMessage('');
      setEmailErr('');
      setSendErr('');
    }, 2800);
    return () => clearTimeout(t);
  }, [stage]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (stage === 'open' || stage === 'success')) close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [stage]);

  function open() {
    setSendErr('');
    setEmailErr('');
    setStage('open');
  }

  function close() {
    setStage('idle');
    setEmail('');
    setMessage('');
    setEmailErr('');
    setSendErr('');
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) close();
  }

  async function handleSend() {
    setEmailErr('');
    setSendErr('');

    if (!EMAIL_RE.test(email.trim())) {
      setEmailErr('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) return;

    setStage('sending');
    try {
      const res  = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong.');
      setStage('success');
    } catch (e) {
      setSendErr(e instanceof Error ? e.message : 'Failed to send. Please try again.');
      setStage('open');
    }
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={open}
        aria-label="Open support chat"
        className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
      >
        {/* Chat bubble icon */}
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* ── Modal overlay ── */}
      {(stage === 'open' || stage === 'sending' || stage === 'success') && (
        <div
          ref={backdropRef}
          onClick={handleBackdrop}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Contact support"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close support modal"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            {stage === 'success' ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center px-8 py-14 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-900">Message sent!</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Thanks for reaching out. We'll get back to you at <strong>{email}</strong> as soon as possible.
                </p>
              </div>
            ) : (
              /* ── Form state ── */
              <div className="px-6 pb-6 pt-6">
                {/* Header */}
                <div className="mb-5 flex items-center gap-3 pr-8">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-100">
                    <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Contact Support</h2>
                    <p className="text-xs text-slate-500">We typically reply within 1–2 business days.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Your email <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }}
                      onBlur={() => {
                        if (email && !EMAIL_RE.test(email.trim())) setEmailErr('Please enter a valid email address.');
                      }}
                      placeholder="you@example.com"
                      disabled={stage === 'sending'}
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none placeholder-slate-400 transition focus:ring-2 disabled:opacity-60 ${
                        emailErr
                          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
                          : 'border-slate-200 bg-slate-50 focus:border-brand-400 focus:bg-white focus:ring-brand-100'
                      }`}
                    />
                    {emailErr && (
                      <p className="mt-1 text-xs text-red-600">{emailErr}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Describe how we can help you…"
                      disabled={stage === 'sending'}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none placeholder-slate-400 transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
                    />
                  </div>

                  {/* Send error */}
                  {sendErr && (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{sendErr}</p>
                  )}

                  {/* Send button */}
                  <button
                    onClick={handleSend}
                    disabled={!canSend || stage === 'sending'}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {stage === 'sending' ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
