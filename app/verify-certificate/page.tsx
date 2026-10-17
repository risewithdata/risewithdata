'use client';

import { useState } from 'react';
import { NavigationBar } from '@features/home/components/NavigationBar.client';

interface CertData {
  certificateNumber: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  trainerName: string;
  issuedDate: string;
  status: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function VerifyCertificatePage() {
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [cert, setCert]     = useState<CertData | null>(null);
  const [error, setError]   = useState('');

  const handleVerify = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setCert(null);
    setError('');
    try {
      const res = await fetch(`/api/certificates/verify?number=${encodeURIComponent(input.trim())}`);
      const j   = await res.json();
      if (!res.ok) throw new Error(j.error ?? 'Verification failed');
      setCert(j.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationBar />

      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-20">

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
              <svg className="h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Verify Certificate</h1>
            <p className="mt-3 text-slate-500">
              Enter a RiseWithData certificate number to verify its authenticity.
            </p>
          </div>

          {/* Search box */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Certificate Number</label>
            <div className="flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}

                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm uppercase tracking-wider outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
              />
              <button
                onClick={handleVerify}
                disabled={loading || !input.trim()}
                className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50 transition"
              >
                {loading ? 'Checking…' : 'Verify'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
              <svg className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <p className="font-semibold text-red-700">Certificate Not Valid</p>
                <p className="mt-0.5 text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Valid Certificate Card */}
          {cert && (
            <div className="mt-6 overflow-hidden rounded-2xl border-2 border-emerald-400 bg-white shadow-lg">

              {/* Verified banner */}
              <div className="flex items-center gap-3 bg-emerald-500 px-6 py-3">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="font-bold text-white">Verified Certificate</span>
                <span className="ml-auto font-mono text-sm font-semibold text-emerald-100">{cert.certificateNumber}</span>
              </div>

              <div className="p-6">
                <div className="grid gap-6 sm:grid-cols-2">

                  {/* Student Details */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Student Details</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-slate-400">Full Name</p>
                        <p className="font-semibold text-slate-900">{cert.studentName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Email</p>
                        <p className="text-sm text-slate-700">{cert.studentEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Course Details</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-slate-400">Course</p>
                        <p className="font-semibold text-slate-900">{cert.courseName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Trainer</p>
                        <p className="text-sm text-slate-700">{cert.trainerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Issued On</p>
                        <p className="text-sm font-medium text-slate-700">{fmtDate(cert.issuedDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-slate-400">
                  This certificate was issued by <span className="font-semibold text-slate-600">RiseWithData</span> and is verified as authentic.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
