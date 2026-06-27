'use client';

import { useState, useEffect, use } from 'react';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  zipcode: string;
  linkedinName: string;
  courseApplied: string | null;
  trainer: string | null;
  status: Status;
  adminNotes: string | null;
  rejectionReason: string | null;
  resumeFileName: string;
  resumeFileType: string;
  resumeFileSizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

type ConfirmAction = 'APPROVED' | 'REJECTED';

const STATUS_META: Record<Status, { label: string; cls: string; dot: string }> = {
  PENDING:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700 border-amber-200',   dot: 'bg-amber-500' },
  APPROVED: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-100 text-red-700 border-red-200',         dot: 'bg-red-500' },
};

function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${m.cls}`}>
      <span className={`h-2 w-2 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 w-32 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-800 text-right break-all">{value || '—'}</span>
    </div>
  );
}

export default function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [app,             setApp]            = useState<Application | null>(null);
  const [loading,         setLoading]        = useState(true);
  const [error,           setError]          = useState('');
  const [notes,           setNotes]          = useState('');
  const [notesSaved,      setNotesSaved]     = useState(false);
  const [notesSaving,     setNotesSaving]    = useState(false);
  const [confirm,         setConfirm]        = useState<ConfirmAction | null>(null);
  const [rejectionReason, setRejectionReason]= useState('');
  const [rejectError,     setRejectError]    = useState('');
  const [actionLoading,   setActionLoading]  = useState(false);
  const [actionError,     setActionError]    = useState('');
  const [infoDialog,      setInfoDialog]     = useState(false);
  const [infoMsg,         setInfoMsg]        = useState('');
  const [infoSending,     setInfoSending]    = useState(false);
  const [infoSent,        setInfoSent]       = useState(false);

  useEffect(() => {
    fetch(`/api/admin/applications/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setApp(j.data as Application);
        setNotes(j.data.adminNotes ?? '');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const saveNotes = async () => {
    setNotesSaving(true);
    await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNotes: notes }),
    });
    setNotesSaving(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  const handleStatusUpdate = async () => {
    if (!confirm) return;
    if (confirm === 'REJECTED' && !rejectionReason.trim()) {
      setRejectError('Please enter a rejection reason before proceeding.');
      return;
    }
    setRejectError('');
    setActionError('');
    setActionLoading(true);
    try {
      const body: Record<string, string> = { status: confirm };
      if (confirm === 'REJECTED') body.rejectionReason = rejectionReason.trim();

      const res  = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setApp((prev) => prev
        ? { ...prev, status: confirm, rejectionReason: confirm === 'REJECTED' ? rejectionReason.trim() : prev.rejectionReason }
        : prev
      );
      setConfirm(null);
      setRejectionReason('');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestInfo = async () => {
    setInfoSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setInfoSending(false);
    setInfoSent(true);
    setTimeout(() => { setInfoSent(false); setInfoDialog(false); setInfoMsg(''); }, 2000);
  };

  const openConfirm = (action: ConfirmAction) => {
    setConfirm(action);
    setRejectionReason('');
    setRejectError('');
    setActionError('');
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const fmtSize = (b: number) => b ? `${(b / 1024 / 1024).toFixed(2)} MB` : '—';
  const shortId = (s: string) => s.slice(-8).toUpperCase();

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-8 w-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-sm text-slate-500">Loading application…</p>
      </div>
    </div>
  );

  if (error || !app) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 font-medium">{error || 'Application not found'}</p>
        <a href="/dashboard/admin/applications" className="mt-4 inline-block text-sm text-blue-600 hover:underline">← Back to Applications</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <a href="/"><img src="/logo.svg" alt="RiseWithData" className="h-9 w-auto" /></a>
            <span className="hidden rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 sm:block">Admin</span>
          </div>
          <nav className="flex items-center gap-1">
            <a href="/dashboard/admin/applications" className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">Applications</a>
            <a href="/dashboard/admin/courses"      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Courses</a>
            <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}
              className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-6 py-8">

        {/* ── Back + heading ── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/dashboard/admin/applications"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back
            </a>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Application Review</h1>
              <p className="text-xs text-slate-500">#{shortId(app.id)}</p>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ══ LEFT COLUMN ══ */}
          <div className="space-y-6 lg:col-span-2">

            {/* Student Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white">
                  {app.firstName[0]}{app.lastName[0]}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{app.firstName} {app.lastName}</h2>
                  <p className="text-xs text-slate-500">{app.email}</p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                <h3 className="flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Student Information
                </h3>
                <InfoRow label="Full Name"    value={`${app.firstName} ${app.lastName}`} />
                <InfoRow label="Email"        value={app.email} />
                <InfoRow label="LinkedIn"     value={app.linkedinName} />
                <InfoRow label="Zipcode"      value={app.zipcode} />
                <InfoRow label="Applied On"   value={fmtDate(app.createdAt)} />
                <InfoRow label="Last Updated" value={fmtDate(app.updatedAt)} />
              </div>
            </div>

            {/* Course Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Course Details
              </h3>
              <div className="divide-y divide-slate-100">
                <InfoRow label="Course"  value={app.courseApplied ?? '—'} />
                <InfoRow label="Trainer" value={app.trainer ?? '—'} />
              </div>
              {!app.courseApplied && (
                <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
                  No course selected — student applied without choosing a specific course.
                </p>
              )}
            </div>

            {/* Rejection Reason — only visible when rejected */}
            {app.status === 'REJECTED' && app.rejectionReason && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                  Rejection Reason
                </h3>
                <p className="text-sm text-red-800 leading-relaxed">{app.rejectionReason}</p>
              </div>
            )}

            {/* Uploaded Documents */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                Uploaded Documents
              </h3>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                    <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{app.resumeFileName}</p>
                    <p className="text-xs text-slate-500">{fmtSize(app.resumeFileSizeBytes)} · {app.resumeFileType?.split('/').pop()?.toUpperCase() ?? 'Document'}</p>
                  </div>
                </div>
                <span className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500">
                  Submitted with application
                </span>
              </div>
            </div>

          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="space-y-6">

            {/* Application Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Application Status
              </h3>
              <StatusBadge status={app.status} />
              <div className="mt-4 space-y-2 text-xs text-slate-500">
                <div className="flex justify-between"><span>Application ID</span><span className="font-mono font-medium text-slate-700">#{shortId(app.id)}</span></div>
                <div className="flex justify-between"><span>Submitted</span><span className="text-slate-700">{fmtDate(app.createdAt)}</span></div>
                <div className="flex justify-between"><span>Last Updated</span><span className="text-slate-700">{fmtDate(app.updatedAt)}</span></div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Admin Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Add private notes about this application…"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={saveNotes}
                disabled={notesSaving}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {notesSaving ? 'Saving…' : notesSaved ? '✓ Saved!' : 'Save Notes'}
              </button>
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <h3 className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Actions
              </h3>

              {app.status !== 'APPROVED' && (
                <button
                  onClick={() => openConfirm('APPROVED')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Approve Application
                </button>
              )}

              {app.status !== 'REJECTED' && (
                <button
                  onClick={() => openConfirm('REJECTED')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-red-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Reject Application
                </button>
              )}

              <button
                onClick={() => setInfoDialog(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                Request More Information
              </button>

              {(app.status === 'APPROVED' || app.status === 'REJECTED') && (
                <p className="text-center text-xs text-slate-400">
                  {app.status === 'APPROVED' ? 'This application has been approved.' : 'This application has been rejected.'}
                </p>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* ── Confirm Dialog ── */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${confirm === 'APPROVED' ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {confirm === 'APPROVED' ? (
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900">
              {confirm === 'APPROVED' ? 'Approve Application' : 'Reject Application'}
            </h3>
            <p className="mt-2 text-center text-sm text-slate-500">
              Are you sure you want to <strong>{confirm === 'APPROVED' ? 'approve' : 'reject'}</strong> the application from{' '}
              <strong>{app.firstName} {app.lastName}</strong>?
              {confirm === 'APPROVED' && (
                <span className="mt-1 block text-xs text-emerald-600">
                  A notification email will be sent to the student.
                </span>
              )}
            </p>

            {/* Rejection reason input — only shown when rejecting */}
            {confirm === 'REJECTED' && (
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => { setRejectionReason(e.target.value); setRejectError(''); }}
                  rows={3}
                  placeholder="Explain why this application is being rejected…"
                  className={`w-full resize-none rounded-xl border px-3 py-2.5 text-sm text-slate-800 outline-none placeholder-slate-400 focus:ring-2 focus:ring-red-100 ${
                    rejectError ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-red-400 focus:bg-white'
                  }`}
                />
                {rejectError && (
                  <p className="mt-1 text-xs text-red-600">{rejectError}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">This reason will be included in the rejection email sent to the student.</p>
              </div>
            )}

            {actionError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{actionError}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setConfirm(null); setRejectionReason(''); setRejectError(''); setActionError(''); }}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={actionLoading}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${confirm === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {actionLoading ? 'Saving…' : confirm === 'APPROVED' ? 'Yes, Approve' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Request More Info Dialog ── */}
      {infoDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900">Request More Information</h3>
            <p className="mt-1 text-center text-sm text-slate-500">
              Send a message to <strong>{app.firstName} {app.lastName}</strong> at <strong>{app.email || 'no email on file'}</strong>
            </p>
            <textarea
              value={infoMsg}
              onChange={(e) => setInfoMsg(e.target.value)}
              rows={4}
              placeholder="Describe what additional information you need from the student…"
              className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={() => { setInfoDialog(false); setInfoMsg(''); }} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button
                onClick={handleRequestInfo}
                disabled={!infoMsg.trim() || infoSending || infoSent}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {infoSending ? 'Sending…' : infoSent ? '✓ Sent!' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
