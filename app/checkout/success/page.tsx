'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NavigationBar } from '@features/home/components/NavigationBar.client';

interface SessionData {
  status: string;
  customerEmail: string;
  courseName: string;
  fullName: string;
  amount: number;
}

function SuccessContent() {
  const params    = useSearchParams();
  const sessionId = params.get('session_id') ?? '';
  const [data, setData]       = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`/api/payments/verify-session?session_id=${sessionId}`)
      .then(r => r.json())
      .then(j => { setData(j); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  return (
    <>
      <NavigationBar />
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-lg px-6 py-20 text-center">

          {loading ? (
            <div className="h-16 w-16 mx-auto animate-pulse rounded-full bg-slate-200" />
          ) : (
            <>
              {/* Success icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-slate-900">Payment Successful!</h1>
              <p className="mt-3 text-slate-500">
                Welcome to RiseWithData. Your enrollment is confirmed.
              </p>

              {data && (
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
                  <div className="space-y-3">
                    {data.fullName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Name</span>
                        <span className="font-medium text-slate-800">{data.fullName}</span>
                      </div>
                    )}
                    {data.customerEmail && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Email</span>
                        <span className="font-medium text-slate-800">{data.customerEmail}</span>
                      </div>
                    )}
                    {data.courseName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Course</span>
                        <span className="font-medium text-slate-800">{data.courseName} Plan</span>
                      </div>
                    )}
                    {data.amount && (
                      <div className="flex justify-between text-sm border-t border-slate-100 pt-3">
                        <span className="font-semibold text-slate-700">Amount Paid</span>
                        <span className="font-bold text-slate-900">${(data.amount / 100).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 rounded-xl border border-brand-100 bg-brand-50 p-5 text-left">
                <p className="text-sm font-semibold text-brand-800">What happens next?</p>
                <ul className="mt-2 space-y-1.5 text-sm text-brand-700">
                  <li>• Our team will reach out within 24 hours</li>
                  <li>• You will receive course access details via email</li>
                  <li>• Check your inbox for a payment confirmation from Stripe</li>
                </ul>
              </div>

              <a
                href="/"
                className="mt-8 inline-block rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-slate-700"
              >
                Back to Home
              </a>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
