'use client';

import { useState, useEffect, useCallback } from 'react';

interface Enrollment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  courseName: string;
  amount: number;
  stripeSessionId: string | null;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  paidAt: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  paid: number;
  pending: number;
  failed: number;
  cancelled: number;
  revenue: number;
}

const STATUS_STYLE: Record<string, string> = {
  PAID:      'bg-emerald-100 text-emerald-700',
  PENDING:   'bg-amber-100 text-amber-700',
  FAILED:    'bg-red-100 text-red-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

const COURSES = ['Core', 'Advanced', 'Elite'];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtAmount(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function AdminPaymentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats]             = useState<Stats | null>(null);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);

  const fetchData = useCallback(async (p = 1, status = statusFilter, course = courseFilter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), pageSize: '20' });
    if (status) params.set('status', status);
    if (course) params.set('course', course);
    const res = await fetch(`/api/admin/payments?${params}`);
    const j   = await res.json();
    setEnrollments(j.data ?? []);
    setStats(j.stats ?? null);
    setTotalPages(j.totalPages ?? 1);
    setTotal(j.total ?? 0);
    setLoading(false);
  }, [statusFilter, courseFilter]);

  useEffect(() => { fetchData(1, statusFilter, courseFilter); }, [statusFilter, courseFilter]);

  const handleFilter = (key: 'status' | 'course', val: string) => {
    setPage(1);
    if (key === 'status') setStatusFilter(val);
    else setCourseFilter(val);
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
          <nav className="flex flex-wrap items-center gap-1">
            <a href="/dashboard/admin"              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Dashboard</a>
            <a href="/dashboard/admin/applications" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Student Apps</a>
            <a href="/dashboard/admin/volunteers"   className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Volunteers</a>
            <a href="/dashboard/admin/instructors"  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Instructors</a>
            <a href="/dashboard/admin/courses"      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Courses</a>
            <a href="/dashboard/admin/students"     className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Students</a>
            <a href="/dashboard/admin/certificates" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Certificates</a>
            <a href="/dashboard/admin/payments"     className="rounded-lg bg-brand-100 px-3 py-2 text-sm font-medium text-brand-700">Payments</a>
            <button
              onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}
              className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-6 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="mt-0.5 text-sm text-slate-500">All enrollment payments and their status</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: 'Total Revenue',  value: `$${(stats.revenue / 100).toFixed(0)}`, color: 'text-emerald-600' },
              { label: 'Paid',           value: stats.paid,      color: 'text-emerald-600' },
              { label: 'Pending',        value: stats.pending,   color: 'text-amber-500' },
              { label: 'Failed',         value: stats.failed,    color: 'text-red-500' },
              { label: 'Cancelled',      value: stats.cancelled, color: 'text-slate-400' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
                <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={e => handleFilter('status', e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-300"
          >
            <option value="">All Statuses</option>
            {['PAID', 'PENDING', 'FAILED', 'CANCELLED'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={courseFilter}
            onChange={e => handleFilter('course', e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-300"
          >
            <option value="">All Courses</option>
            {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <span className="ml-auto self-center text-sm text-slate-400">{total} record{total !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Student', 'Email', 'Phone', 'City', 'Course', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 animate-pulse rounded bg-slate-100" /></td>
                      ))}
                    </tr>
                  ))
                ) : enrollments.length === 0 ? (
                  <tr><td colSpan={8} className="py-16 text-center text-sm text-slate-400">No payments found</td></tr>
                ) : enrollments.map(e => (
                  <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{e.fullName}</td>
                    <td className="px-4 py-3 text-slate-500">{e.email}</td>
                    <td className="px-4 py-3 text-slate-500">{e.phone}</td>
                    <td className="px-4 py-3 text-slate-500">{e.city}</td>
                    <td className="px-4 py-3 text-slate-600">{e.courseName}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{fmtAmount(e.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[e.status]}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{fmtDate(e.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
              <button
                onClick={() => { const p = Math.max(1, page - 1); setPage(p); fetchData(p); }}
                disabled={page === 1}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >← Prev</button>
              <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
              <button
                onClick={() => { const p = Math.min(totalPages, page + 1); setPage(p); fetchData(p); }}
                disabled={page === totalPages}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >Next →</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
