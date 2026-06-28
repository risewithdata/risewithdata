'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  courseApplied: string | null;
  trainer: string | null;
  status: Status;
  resumeFileName: string;
  linkedinName: string;
  zipcode: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: Application[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: { total: number; PENDING: number; APPROVED: number; REJECTED: number };
}

interface ConfirmDialog {
  id: string;
  name: string;
  action: 'APPROVED' | 'REJECTED';
}

const PAGE_SIZE = 10;

const COURSES = [
  'Power BI Data Analyst Fellowship',
  'Cohort Washington',
  'Cohort Lincoln',
];

const STATUS_BADGE: Record<Status, { label: string; cls: string }> = {
  PENDING:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700 border border-amber-200' },
  APPROVED: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-100 text-red-700 border border-red-200' },
};

function StatusBadge({ status }: { status: Status }) {
  const { label, cls } = STATUS_BADGE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        status === 'PENDING' ? 'bg-amber-500' : status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'
      }`} />
      {label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${60 + (i * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function AdminApplicationsPage() {
  const [data, setData]             = useState<Application[]>([]);
  const [stats, setStats]           = useState({ total: 0, PENDING: 0, APPROVED: 0, REJECTED: 0 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);

  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('');
  const [courseFilter, setCourse] = useState('');
  const [dateFrom, setDateFrom]   = useState('');
  const [dateTo, setDateTo]       = useState('');

  const [confirm, setConfirm]         = useState<ConfirmDialog | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const searchRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchData = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        search, status: statusFilter, course: courseFilter,
        dateFrom, dateTo,
        page: String(currentPage),
        pageSize: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/admin/applications?${params}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `Error ${res.status}`);
      }
      const json: ApiResponse = await res.json();
      setData(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);
      setStats(json.stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, courseFilter, dateFrom, dateTo]);

  // Debounce search; reset page and fetch on any filter change
  useEffect(() => {
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setPage(1);
      fetchData(1);
    }, search ? 300 : 0);
    return () => clearTimeout(searchRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, courseFilter, dateFrom, dateTo]);

  // Fetch when page changes (but not on initial render — handled above)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    fetchData(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleStatusUpdate = async () => {
    if (!confirm) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/applications/${confirm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: confirm.action }),
      });
      if (res.ok) {
        setData((prev) => prev.map((a) => a.id === confirm.id ? { ...a, status: confirm.action } : a));
        setStats((prev) => {
          const old = data.find((a) => a.id === confirm.id)?.status;
          if (!old) return prev;
          return {
            ...prev,
            [old]: prev[old] - 1,
            [confirm.action]: prev[confirm.action] + 1,
          };
        });
      }
    } finally {
      setActionLoading(false);
      setConfirm(null);
    }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const shortId = (id: string) => id.slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <a href="/">
              <img src="/logo.jpeg" alt="RiseWithData" className="h-14 w-auto mix-blend-multiply" />
            </a>
            <span className="hidden rounded-md bg-brand-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 sm:block">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <a href="/dashboard/admin"              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Dashboard</a>
            <a href="/dashboard/admin/applications" className="rounded-lg bg-brand-100 px-3 py-2 text-sm font-medium text-brand-700">Applications</a>
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

        {/* ── Page heading ── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Student Applications</h1>
            <p className="mt-0.5 text-sm text-slate-500">{total} total applications</p>
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total',    value: stats.total,    color: 'text-slate-700',   bg: 'bg-white',         border: 'border-slate-200' },
            { label: 'Pending',  value: stats.PENDING,  color: 'text-amber-600',   bg: 'bg-amber-50',      border: 'border-amber-200' },
            { label: 'Approved', value: stats.APPROVED, color: 'text-emerald-600', bg: 'bg-emerald-50',    border: 'border-emerald-200' },
            { label: 'Rejected', value: stats.REJECTED, color: 'text-red-600',     bg: 'bg-red-50',        border: 'border-red-200' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border ${s.border} ${s.bg} px-5 py-4 shadow-sm`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
              <p className={`mt-1.5 text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
            <button onClick={() => fetchData(page)} className="ml-auto text-xs font-semibold underline hover:no-underline">Retry</button>
          </div>
        )}

        {/* ── Filters ── */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-brand-200 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => { setCourse(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-200 focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Courses</option>
            {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-200 focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Date range */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-brand-200 focus:ring-2 focus:ring-brand-500"
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-brand-200 focus:ring-2 focus:ring-brand-500"
          />

          {/* Clear filters */}
          {(search || statusFilter || courseFilter || dateFrom || dateTo) && (
            <button
              onClick={() => { setSearch(''); setStatus(''); setCourse(''); setDateFrom(''); setDateTo(''); setPage(1); }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>

        {/* ── Table card ── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
                  {['App ID', 'Student Name', 'Email', 'Course Applied', 'Trainer', 'Applied Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonRow key={i} />)
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                          <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="font-semibold text-slate-700">No applications found</p>
                        <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((app) => (
                    <tr key={app.id} className="border-b border-slate-100 transition hover:bg-brand-50">
                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                          #{shortId(app.id)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                            {app.firstName[0]}{app.lastName[0]}
                          </div>
                          <span className="font-medium text-slate-800">{app.firstName} {app.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{app.email || '—'}</td>
                      <td className="px-4 py-3.5">
                        {app.courseApplied
                          ? <span className="text-slate-700">{app.courseApplied}</span>
                          : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        {app.trainer
                          ? <span className="text-slate-700">{app.trainer}</span>
                          : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{fmtDate(app.createdAt)}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {/* View Details */}
                          <a
                            href={`/dashboard/admin/applications/${app.id}`}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                          >
                            View Details
                          </a>
                          {/* Approve */}
                          {app.status !== 'APPROVED' && (
                            <button
                              onClick={() => setConfirm({ id: app.id, name: `${app.firstName} ${app.lastName}`, action: 'APPROVED' })}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                            >
                              Approve
                            </button>
                          )}
                          {/* Reject */}
                          {app.status !== 'REJECTED' && (
                            <button
                              onClick={() => setConfirm({ id: app.id, name: `${app.firstName} ${app.lastName}`, action: 'REJECTED' })}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <p className="text-sm text-slate-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                >«</button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                >Prev</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const pg = start + i;
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        pg === page
                          ? 'border-brand-200 bg-brand-600 text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >{pg}</button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                >Next</button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                >»</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Confirm Dialog ── */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              confirm.action === 'APPROVED' ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              {confirm.action === 'APPROVED' ? (
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900">
              {confirm.action === 'APPROVED' ? 'Approve Application' : 'Reject Application'}
            </h3>
            <p className="mt-2 text-center text-sm text-slate-500">
              Are you sure you want to <strong>{confirm.action === 'APPROVED' ? 'approve' : 'reject'}</strong> the application from <strong>{confirm.name}</strong>?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={actionLoading}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${
                  confirm.action === 'APPROVED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionLoading ? 'Saving…' : confirm.action === 'APPROVED' ? 'Yes, Approve' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
