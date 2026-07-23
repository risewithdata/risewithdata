'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@shared/ui/ToastProvider';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  zipcode: string;
  linkedinName: string;
  resumeFileName: string;
  resumeFileType: string;
  resumeFileSizeBytes: number;
  status: Status;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_META: Record<Status, { label: string; cls: string; dot: string }> = {
  PENDING:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700 border-amber-200',   dot: 'bg-amber-500' },
  APPROVED: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-100 text-red-700 border-red-200',         dot: 'bg-red-500' },
};

const NAV = [
  { href: '/dashboard/admin',              label: 'Dashboard' },
  { href: '/dashboard/admin/applications', label: 'Student Apps' },
  { href: '/dashboard/admin/volunteers',   label: 'Volunteers', active: true },
  { href: '/dashboard/admin/instructors',  label: 'Instructors' },
  { href: '/dashboard/admin/courses',      label: 'Courses' },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
function fmtBytes(bytes: number) {
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${m.cls}`}>
      <span className={`h-2 w-2 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

export default function VolunteerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { showSuccess, showError } = useToast();

  const [vol,           setVol]          = useState<Volunteer | null>(null);
  const [loading,       setLoading]      = useState(true);
  const [error,         setError]        = useState('');
  const [confirm,       setConfirm]      = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [reason,        setReason]       = useState('');
  const [reasonErr,     setReasonErr]    = useState('');
  const [actionLoading, setActionLoading]= useState(false);
  const [actionError,   setActionError]  = useState('');
  const [emailWarning,  setEmailWarning] = useState('');
  const [resendLoading, setResendLoading]= useState(false);
  const [resendDone,    setResendDone]   = useState(false);

  useEffect(() => {
    fetch(`/api/admin/volunteers/${id}`)
      .then((r) => r.json())
      .then((j) => { if (j.error) throw new Error(j.error); setVol(j.data); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const openConfirm = (action: 'APPROVED' | 'REJECTED') => {
    setConfirm(action);
    setReason('');
    setReasonErr('');
    setActionError('');
  };

  const handleDecision = async () => {
    if (!confirm) return;
    if (confirm === 'REJECTED' && !reason.trim()) {
      setReasonErr('Please enter a rejection reason.');
      return;
    }
    setReasonErr('');
    setActionError('');
    setActionLoading(true);
    try {
      const res  = await fetch(`/api/admin/volunteers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: confirm, rejectionReason: reason.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setActionError(json.error ?? 'Something went wrong.'); return; }
      setVol((v) => v ? { ...v, status: confirm, adminNotes: confirm === 'REJECTED' ? reason.trim() : v.adminNotes } : v);
      setConfirm(null);
      setReason('');
      if (json.emailSent === false) {
        const warningMsg = json.emailError ?? 'Status updated but notification email could not be sent. Use "Resend Email" to retry.';
        setEmailWarning(warningMsg);
        showError(`${confirm === 'APPROVED' ? 'Volunteer approved' : 'Volunteer rejected'} but email failed to send.`);
      } else {
        showSuccess(confirm === 'APPROVED' ? 'Volunteer approved! Email sent.' : 'Volunteer rejected. Email sent.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setEmailWarning('');
    try {
      const res  = await fetch(`/api/admin/volunteers/${id}/resend`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        const errMsg = json.error ?? 'Failed to resend email.';
        setEmailWarning(errMsg);
        showError(errMsg);
      } else {
        showSuccess('Approval email resent successfully!');
        setResendDone(true);
        setTimeout(() => setResendDone(false), 4000);
      }
    } catch {
      const errMsg = 'Network error. Please try again.';
      setEmailWarning(errMsg);
      showError(errMsg);
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <svg className="h-8 w-8 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <a href="/" className="no-underline"><img src="/logo.svg" alt="RiseWithData" className="h-14 w-auto mix-blend-multiply" /></a>
            <span className="hidden rounded-md bg-brand-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 sm:block">Admin</span>
          </div>
          <nav className="flex items-center gap-1">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${n.active ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                {n.label}
              </a>
            ))}
            <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}
              className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-6 py-8">

        {/* Back + heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/dashboard/admin/volunteers"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back
            </a>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Volunteer Application</h1>
              {vol && <p className="text-xs text-slate-500">#{vol.id.slice(-8).toUpperCase()}</p>}
            </div>
          </div>
          {vol && <StatusBadge status={vol.status} />}
        </div>

        {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {vol && (
          <div className="grid gap-6 lg:grid-cols-3">

            {/* ══ LEFT ══ */}
            <div className="space-y-6 lg:col-span-2">

              {/* Hero */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-xl font-bold text-white">
                    {vol.firstName[0]}{vol.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{vol.firstName} {vol.lastName}</h2>
                    <p className="text-sm text-slate-500">{vol.email}</p>
                    <p className="text-xs text-slate-400">Applied {fmtDate(vol.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Contact & Profile</h3>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Email',    node: <a href={`mailto:${vol.email}`} className="text-brand-600 hover:underline">{vol.email}</a> },
                    { label: 'Zipcode',  node: <span>{vol.zipcode}</span> },
                    { label: 'LinkedIn', node: <a href={`https://linkedin.com/in/${vol.linkedinName}`} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">linkedin.com/in/{vol.linkedinName}</a> },
                    { label: 'Applied',  node: <span>{fmtDate(vol.createdAt)}</span> },
                  ].map(({ label, node }) => (
                    <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
                      <dd className="mt-1 text-sm font-medium text-slate-800">{node}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Resume */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Uploaded Resume</h3>
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{vol.resumeFileName}</p>
                    <p className="text-xs text-slate-400">{vol.resumeFileType} · {fmtBytes(vol.resumeFileSizeBytes)}</p>
                  </div>
                </div>
              </div>

              {/* Rejection reason */}
              {vol.status === 'REJECTED' && vol.adminNotes && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-red-600">Rejection Reason</h3>
                  <p className="text-sm text-red-800 leading-relaxed">{vol.adminNotes}</p>
                </div>
              )}
            </div>

            {/* ══ RIGHT ══ */}
            <div className="space-y-6">

              {/* Status card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Application Status</h3>
                <StatusBadge status={vol.status} />
                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between"><span>Application ID</span><span className="font-mono font-medium text-slate-700">#{vol.id.slice(-8).toUpperCase()}</span></div>
                  <div className="flex justify-between"><span>Submitted</span><span className="text-slate-700">{fmtDate(vol.createdAt)}</span></div>
                  <div className="flex justify-between"><span>Last Updated</span><span className="text-slate-700">{fmtDate(vol.updatedAt)}</span></div>
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</h3>

                {vol.status !== 'APPROVED' && (
                  <button onClick={() => openConfirm('APPROVED')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Approve Application
                  </button>
                )}

                {vol.status !== 'REJECTED' && (
                  <button onClick={() => openConfirm('REJECTED')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md shadow-red-500/20 hover:bg-red-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Reject Application
                  </button>
                )}

                {vol.status === 'APPROVED' && (
                  <button onClick={handleResend} disabled={resendLoading || resendDone}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60">
                    {resendDone ? (
                      <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Email Sent!</>
                    ) : resendLoading ? (
                      <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending…</>
                    ) : (
                      <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>Resend Approval Email</>
                    )}
                  </button>
                )}

                {emailWarning && (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                    {emailWarning}
                  </div>
                )}

                {(vol.status === 'APPROVED' || vol.status === 'REJECTED') && (
                  <p className="text-center text-xs text-slate-400">
                    {vol.status === 'APPROVED' ? 'Approval email sent to volunteer.' : 'This application has been rejected.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Confirm Dialog ── */}
      {confirm && vol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${confirm === 'APPROVED' ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {confirm === 'APPROVED'
                ? <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              }
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900">
              {confirm === 'APPROVED' ? 'Approve Application' : 'Reject Application'}
            </h3>
            <p className="mt-2 text-center text-sm text-slate-500">
              Are you sure you want to <strong>{confirm === 'APPROVED' ? 'approve' : 'reject'}</strong> the application from{' '}
              <strong>{vol.firstName} {vol.lastName}</strong>?
              {confirm === 'APPROVED' && (
                <span className="mt-1 block text-xs text-emerald-600">A notification email will be sent to the volunteer.</span>
              )}
            </p>

            {confirm === 'REJECTED' && (
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setReasonErr(''); }}
                  rows={3}
                  placeholder="Explain why this application is being rejected…"
                  className={`w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none placeholder-slate-400 focus:ring-2 ${
                    reasonErr ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-red-400 focus:ring-red-100'
                  }`}
                />
                {reasonErr && <p className="mt-1 text-xs text-red-600">{reasonErr}</p>}
                <p className="mt-1 text-xs text-slate-400">This reason will be included in the rejection email.</p>
              </div>
            )}

            {actionError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{actionError}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button onClick={() => { setConfirm(null); setReason(''); setReasonErr(''); setActionError(''); }}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleDecision} disabled={actionLoading}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${confirm === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {actionLoading ? 'Saving…' : confirm === 'APPROVED' ? 'Yes, Approve' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
