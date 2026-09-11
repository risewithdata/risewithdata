'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@shared/ui/ToastProvider';

interface Instructor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  createdAt: string;
}

interface Course {
  id: string;
  name: string;
  duration: string;
  startDate: string | null;
  endDate: string | null;
  seatsAvailable: number;
  applicationsReceived: number;
  status: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  courseApplied: string;
  createdAt: string;
}

interface UpcomingSlot {
  id: string;
  courseName: string;
  title: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  location: string | null;
}

interface Stats {
  totalCourses: number;
  totalStudents: number;
  totalAnnouncements: number;
  totalMaterials: number;
}

const NAV = [
  { href: '/dashboard/admin',              label: 'Dashboard' },
  { href: '/dashboard/admin/applications', label: 'Student Apps' },
  { href: '/dashboard/admin/volunteers',   label: 'Volunteers' },
  { href: '/dashboard/admin/instructors',  label: 'Instructors', active: true },
  { href: '/dashboard/admin/courses',      label: 'Courses' },
  { href: '/dashboard/admin/students',     label: 'Students' },
];

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

export default function InstructorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { showSuccess, showError } = useToast();

  const [instructor,    setInstructor]    = useState<Instructor | null>(null);
  const [courses,       setCourses]       = useState<Course[]>([]);
  const [students,      setStudents]      = useState<Student[]>([]);
  const [upcomingSlots, setUpcomingSlots] = useState<UpcomingSlot[]>([]);
  const [stats,         setStats]         = useState<Stats | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [confirm,       setConfirm]       = useState<'approve' | 'reject' | null>(null);
  const [reason,        setReason]        = useState('');
  const [reasonErr,     setReasonErr]     = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError,   setActionError]   = useState('');
  const [emailWarning,  setEmailWarning]  = useState('');

  useEffect(() => {
    fetch(`/api/admin/instructors/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setInstructor(j.instructor as Instructor);
        setCourses(j.courses as Course[]);
        setStudents(j.students as Student[]);
        setUpcomingSlots(j.upcomingSlots as UpcomingSlot[]);
        setStats(j.stats as Stats);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const openConfirm = (action: 'approve' | 'reject') => {
    setConfirm(action); setReason(''); setReasonErr(''); setActionError('');
  };

  const handleAction = async () => {
    if (!confirm || !instructor) return;
    if (confirm === 'reject' && !reason.trim()) { setReasonErr('Please enter a reason.'); return; }
    setReasonErr(''); setActionError(''); setActionLoading(true);
    try {
      const res  = await fetch(`/api/admin/instructors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: confirm, reason: reason.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setActionError(json.error ?? 'Something went wrong.'); return; }
      setInstructor((prev) => prev ? { ...prev, active: json.active } : prev);
      setConfirm(null); setReason('');
      if (json.emailSent === false) {
        const warningMsg = json.emailError ?? 'Status updated but notification email could not be sent.';
        setEmailWarning(warningMsg);
        showError(`Instructor ${confirm === 'approve' ? 'activated' : 'deactivated'} but email failed to send.`);
      } else {
        showSuccess(confirm === 'approve' ? 'Instructor account activated! Email sent.' : 'Instructor deactivated. Email sent.');
      }
    } finally {
      setActionLoading(false);
    }
  };

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

        {/* Back */}
        <a href="/dashboard/admin/instructors"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Instructors
        </a>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : instructor ? (
          <div className="space-y-6">

            {/* Hero + Actions grid */}
            <div className="grid gap-6 lg:grid-cols-3">

              {/* Hero */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 text-xl font-bold text-white">
                      {instructor.firstName[0]}{instructor.lastName[0]}
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-900">{instructor.firstName} {instructor.lastName}</h1>
                      <a href={`mailto:${instructor.email}`} className="text-sm text-brand-600 hover:underline">{instructor.email}</a>
                      <p className="mt-0.5 text-xs text-slate-400">Instructor since {fmtDate(instructor.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${instructor.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {instructor.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Actions panel */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</h3>

                {!instructor.active && (
                  <button onClick={() => openConfirm('approve')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Approve (Activate)
                  </button>
                )}

                {instructor.active && (
                  <button onClick={() => openConfirm('reject')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md shadow-red-500/20 hover:bg-red-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Reject (Deactivate)
                  </button>
                )}

                {emailWarning && (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                    {emailWarning}
                  </div>
                )}

                <p className="text-center text-xs text-slate-400">
                  {instructor.active ? 'Account is active — email sent on deactivation.' : 'Account is inactive — email sent on activation.'}
                </p>
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Courses" value={stats.totalCourses} color="bg-purple-50"
                  icon={<svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>} />
                <StatCard label="Students" value={stats.totalStudents} color="bg-teal-50"
                  icon={<svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                <StatCard label="Announcements" value={stats.totalAnnouncements} color="bg-amber-50"
                  icon={<svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>} />
                <StatCard label="Materials" value={stats.totalMaterials} color="bg-brand-50"
                  icon={<svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>} />
              </div>
            )}

            {/* Main grid */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* Assigned Courses */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="text-sm font-bold text-slate-800">Assigned Courses</h2>
                </div>
                {courses.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-400">No courses assigned</p>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {courses.map((c) => (
                      <div key={c.id} className="flex items-start justify-between gap-3 px-6 py-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">{c.name}</p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {fmtDate(c.startDate)} → {fmtDate(c.endDate)} · {c.duration}
                          </p>
                          <p className="text-xs text-slate-400">{c.seatsAvailable} seats · {c.applicationsReceived} applied</p>
                        </div>
                        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {c.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Schedule */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="text-sm font-bold text-slate-800">Upcoming Sessions</h2>
                </div>
                {upcomingSlots.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-400">No upcoming sessions</p>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {upcomingSlots.map((s) => (
                      <div key={s.id} className="px-6 py-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                            <p className="text-xs text-slate-400">{s.courseName}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-semibold text-slate-700">{fmtDateTime(s.slotDate)}</p>
                            <p className="text-xs text-slate-400">{s.startTime} – {s.endTime}</p>
                          </div>
                        </div>
                        {s.location && <p className="mt-1 text-xs text-slate-400">📍 {s.location}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enrolled Students */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-sm font-bold text-slate-800">Enrolled Students</h2>
                <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700">{students.length}</span>
              </div>
              {students.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">No enrolled students</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead>
                      <tr className="bg-slate-50">
                        {['Student', 'Email', 'Course', 'Enrolled'].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {students.map((s) => (
                        <tr key={s.id} className="hover:bg-brand-50 transition-colors">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                                {s.firstName[0]}{s.lastName[0]}
                              </div>
                              <p className="text-sm font-medium text-slate-800">{s.firstName} {s.lastName}</p>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600">{s.email}</td>
                          <td className="px-6 py-3 text-sm text-slate-600">{s.courseApplied}</td>
                          <td className="px-6 py-3 text-sm text-slate-400">{fmtDate(s.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        ) : null}
      </main>

      {/* ── Confirm Dialog ── */}
      {confirm && instructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${confirm === 'approve' ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {confirm === 'approve'
                ? <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              }
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900">
              {confirm === 'approve' ? 'Approve Instructor' : 'Deactivate Instructor'}
            </h3>
            <p className="mt-2 text-center text-sm text-slate-500">
              {confirm === 'approve'
                ? <>Activate <strong>{instructor.firstName} {instructor.lastName}</strong>'s account? An approval email will be sent.</>
                : <>Deactivate <strong>{instructor.firstName} {instructor.lastName}</strong>'s account?</>
              }
            </p>

            {confirm === 'reject' && (
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setReasonErr(''); }}
                  rows={3}
                  placeholder="Explain why this account is being deactivated…"
                  className={`w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none placeholder-slate-400 focus:ring-2 ${
                    reasonErr ? 'border-red-400 bg-red-50 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-red-400 focus:ring-red-100'
                  }`}
                />
                {reasonErr && <p className="mt-1 text-xs text-red-600">{reasonErr}</p>}
                <p className="mt-1 text-xs text-slate-400">This reason will be included in the email to the instructor.</p>
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
              <button onClick={handleAction} disabled={actionLoading}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${confirm === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {actionLoading ? 'Saving…' : confirm === 'approve' ? 'Yes, Approve' : 'Yes, Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
