'use client';

import { useState, useEffect } from 'react';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED';
type CourseStatus = 'ACTIVE' | 'INACTIVE';

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalCourses: number;
  activeCourses: number;
  totalSeatsAvailable: number;
  recentAppsCount: number;
  prevAppsCount: number;
}

interface RecentApp {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  courseApplied: string | null;
  status: Status;
  createdAt: string;
}

interface Course {
  id: string;
  name: string;
  trainerName: string;
  seatsAvailable: number;
  applicationsReceived: number;
  status: CourseStatus;
  startDate: string | null;
  endDate: string | null;
}

interface AppByCourse {
  course: string;
  count: number;
}

const STATUS_BADGE: Record<Status, string> = {
  PENDING:  'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function trendArrow(current: number, prev: number) {
  if (prev === 0) return null;
  const pct = Math.round(((current - prev) / prev) * 100);
  if (pct === 0) return <span className="text-slate-400 text-xs">No change</span>;
  const up = pct > 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
      {up ? '↑' : '↓'} {Math.abs(pct)}% vs last 30d
    </span>
  );
}

export default function AdminDashboardPage() {
  const [stats,        setStats]        = useState<DashboardStats | null>(null);
  const [recentApps,   setRecentApps]   = useState<RecentApp[]>([]);
  const [courses,      setCourses]      = useState<Course[]>([]);
  const [byCourse,     setByCourse]     = useState<AppByCourse[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setStats(j.stats);
        setRecentApps(j.recentApplications);
        setCourses(j.courses);
        setByCourse(j.appsByCourse);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const maxByCourse = Math.max(...byCourse.map((b) => b.count), 1);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <a href="/"><img src="/logo.jpeg" alt="RiseWithData" className="h-14 w-auto mix-blend-multiply" /></a>
            <span className="hidden rounded-md bg-brand-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-600 sm:block">Admin</span>
          </div>
          <nav className="flex items-center gap-1">
            <a href="/dashboard/admin"              className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-brand-600">Dashboard</a>
            <a href="/dashboard/admin/applications" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Applications</a>
            <a href="/dashboard/admin/courses"      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Courses</a>
            <button
              onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}
              className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-6 py-8">

        {/* ── Page Header ── */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Overview of applications, courses, and activity
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/dashboard/admin/applications"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Applications
            </a>
            <a
              href="/dashboard/admin/courses"
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Manage Courses
            </a>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Stats Row ── */}
        {loading ? (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : stats && (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Total Applications */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Applications</p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">{stats.totalApplications}</p>
                    <div className="mt-1">{trendArrow(stats.recentAppsCount, stats.prevAppsCount)}</div>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600">
                    <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-brand-600 to-brand-500" />
              </div>

              {/* Pending Review */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pending Review</p>
                    <p className="mt-1 text-3xl font-bold text-amber-500">{stats.pendingApplications}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {stats.totalApplications > 0
                        ? `${Math.round((stats.pendingApplications / stats.totalApplications) * 100)}% of total`
                        : 'No applications yet'}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                    <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                {stats.pendingApplications > 0 && (
                  <a
                    href="/dashboard/admin/applications?status=PENDING"
                    className="absolute bottom-0 left-0 w-full bg-amber-50 py-1.5 text-center text-xs font-semibold text-amber-700 hover:bg-amber-100"
                  >
                    Review now →
                  </a>
                )}
                {stats.pendingApplications === 0 && (
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-300 to-amber-500" />
                )}
              </div>

              {/* Approved */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Approved</p>
                    <p className="mt-1 text-3xl font-bold text-emerald-600">{stats.approvedApplications}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {stats.totalApplications > 0
                        ? `${Math.round((stats.approvedApplications / stats.totalApplications) * 100)}% approval rate`
                        : '—'}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
              </div>

              {/* Rejected */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rejected</p>
                    <p className="mt-1 text-3xl font-bold text-red-500">{stats.rejectedApplications}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {stats.totalApplications > 0
                        ? `${Math.round((stats.rejectedApplications / stats.totalApplications) * 100)}% rejection rate`
                        : '—'}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-red-400 to-red-500" />
              </div>
            </div>

            {/* ── Secondary Stats ── */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Courses</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalCourses}</p>
                  <p className="text-xs text-slate-400">{stats.activeCourses} active</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50">
                  <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Seats Available</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalSeatsAvailable}</p>
                  <p className="text-xs text-slate-400">across active courses</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last 30 Days</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.recentAppsCount}</p>
                  <p className="text-xs text-slate-400">new applications</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Main Grid ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Recent Applications ── */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-800">Recent Applications</h2>
              <a href="/dashboard/admin/applications" className="text-xs font-semibold text-brand-600 hover:underline">View all →</a>
            </div>

            {loading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : recentApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                <svg className="h-10 w-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No applications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentApps.map((app) => (
                  <a
                    key={app.id}
                    href={`/dashboard/admin/applications/${app.id}`}
                    className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-slate-50"
                  >
                    {/* Avatar */}
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 text-xs font-bold text-white">
                      {app.firstName[0]}{app.lastName[0]}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {app.firstName} {app.lastName}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {app.courseApplied ?? 'No course selected'}
                      </p>
                    </div>

                    {/* Status */}
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[app.status]}`}>
                      {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                    </span>

                    {/* Time */}
                    <span className="flex-shrink-0 text-xs text-slate-400">{relativeTime(app.createdAt)}</span>

                    {/* Arrow */}
                    <svg className="h-4 w-4 flex-shrink-0 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">

            {/* Applications by Course */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-sm font-bold text-slate-800">Applications by Course</h2>
              </div>
              {loading ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
                  ))}
                </div>
              ) : byCourse.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">No data yet</p>
              ) : (
                <div className="space-y-4 p-6">
                  {byCourse.map((item, i) => {
                    const pct = Math.round((item.count / maxByCourse) * 100);
                    const colors = ['bg-brand-600', 'bg-purple-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500'];
                    return (
                      <div key={i}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <p className="max-w-[75%] truncate text-xs font-medium text-slate-700">{item.course}</p>
                          <span className="text-xs font-bold text-slate-600">{item.count}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          <div
                            className={`h-2 rounded-full ${colors[i % colors.length]} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Course Overview */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-sm font-bold text-slate-800">Courses</h2>
                <a href="/dashboard/admin/courses" className="text-xs font-semibold text-brand-600 hover:underline">Manage →</a>
              </div>
              {loading ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">No courses yet</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {courses.map((c) => (
                    <div key={c.id} className="px-6 py-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.trainerName}</p>
                        </div>
                        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {c.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {c.seatsAvailable} seats
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                          </svg>
                          {c.applicationsReceived} applied
                        </span>
                        {c.startDate && (
                          <>
                            <span>·</span>
                            <span>{fmtDate(c.startDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Status Breakdown Visual ── */}
        {!loading && stats && stats.totalApplications > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-800">Application Status Breakdown</h2>
            <div className="flex h-4 w-full overflow-hidden rounded-full">
              {stats.approvedApplications > 0 && (
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${(stats.approvedApplications / stats.totalApplications) * 100}%` }}
                  title={`Approved: ${stats.approvedApplications}`}
                />
              )}
              {stats.pendingApplications > 0 && (
                <div
                  className="h-full bg-amber-400 transition-all"
                  style={{ width: `${(stats.pendingApplications / stats.totalApplications) * 100}%` }}
                  title={`Pending: ${stats.pendingApplications}`}
                />
              )}
              {stats.rejectedApplications > 0 && (
                <div
                  className="h-full bg-red-400 transition-all"
                  style={{ width: `${(stats.rejectedApplications / stats.totalApplications) * 100}%` }}
                  title={`Rejected: ${stats.rejectedApplications}`}
                />
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-4">
              {[
                { label: 'Approved', count: stats.approvedApplications, color: 'bg-emerald-500' },
                { label: 'Pending',  count: stats.pendingApplications,  color: 'bg-amber-400' },
                { label: 'Rejected', count: stats.rejectedApplications, color: 'bg-red-400' },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs font-bold text-slate-700">{count}</span>
                  <span className="text-xs text-slate-400">
                    ({Math.round((count / stats.totalApplications) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
