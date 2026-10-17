'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NavigationBar } from '@features/home/components/NavigationBar.client';

function CancelContent() {
  const params       = useSearchParams();
  const enrollmentId = params.get('enrollment_id') ?? '';

  return (
    <>
      <NavigationBar />
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-lg px-6 py-20 text-center">

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <svg className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">Payment Cancelled</h1>
          <p className="mt-3 text-slate-500">
            Your payment was not completed. No charge has been made.
          </p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Your details are saved</p>
            <p className="mt-1 text-sm text-slate-500">
              We have saved your enrollment details. You can retry the payment anytime or contact us if you need help.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={enrollmentId ? `/pricing` : '/pricing'}
              className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-slate-700"
            >
              Try Again
            </a>
            <a
              href="/"
              className="rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Home
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Need help?{' '}
            <a href="/contact" className="underline hover:text-slate-600">Contact us</a>
          </p>
        </div>
      </main>
    </>
  );
}

export default function CancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}
