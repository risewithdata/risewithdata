'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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
  createdAt: string;
}

interface ApiResponse {
  data: Volunteer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ActionDialog {
  id: string;
  name: string;
  action: 'APPROVED' | 'REJECTED';
}

const PAGE_SIZE = 10;

const STATUS_BADGE: Record<Status, string> = {
  PENDING:  'bg-amber-100 text-amber-700 border border-amber-200',
  APPROVED: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  REJECTED: 'bg-red-100 text-red-700 border border-red-200',
};

const NAV = [
  { href: '/dashboard/admin',              label: 'Dashboard' },
  { href: '/dashboard/admin/applications', label: 'Student Apps' },
  { href: '/dashboard/admin/volunteers',   label: 'Volunteers',  active: true },
  { href: '/dashboard/admin/instructors',  label: 'Instructors' },
  { href: '/dashboard/admin/courses',      label: 'Courses' },
  { href: '/dashboard/admin/students',     label: 'Students' },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtBytes(bytes: number) {
  if (bytes < 1024)    return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function VolunteersPage() {
  const [data,         setData]         = useState<ApiResponse | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');
  const [page,         setPage]         = useState(1);
  const [actionDialog, setActionDialog] = useState<ActionDialog | null>(null);
  const [rejection,    setRejection]    = useState('');
  const [saving,       setSaving]       = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback((p = 1, s = search, sf = statusFilter, df = dateFrom, dt = dateTo) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), pageSize: String(PAGE_SIZE) });
    if (s)  params.set('search',   s);
    if (sf) params.set('status',   sf);
    if (df) params.set('dateFrom', df);
    if (dt) params.set('dateTo',   dt);
    fetch(`/api/admin/volunteers?${params}`)
      .then((r) => r.json())
      .then((j) => { if (j.error) throw new Error(j.error); setData(j); setError(''); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, statusFilter, dateFrom, dateTo]);

  useEffect(() => { fetchData(1); }, []);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => fetchData(1, v, statusFilter, dateFrom, dateTo), 350);
  }

  function goPage(p: number) { setPage(p); fetchData(p); }

  async function handleAction() {
    if (!actionDialog) return;
    if (actionDialog.action === 'REJECTED' && !rejection.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/volunteers/${actionDialog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: actionDialog.action, rejectionReason: rejection }),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      setActionDialog(null);
      setRejection('');
      fetchData(page);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setSaving(false);
    }
  }

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

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Volunteer Applications</h1>
            <p className="mt-0.5 text-sm text-slate-500">Review and approve or reject volunteer applications — applicants are emailed automatically</p>
          </div>
          {data && (
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total</span>
              <span className="text-lg font-bold text-slate-900">{data.total}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by name, email, or LinkedIn..."
              value={search} onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20" />
          </div>
          <select value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); fetchData(1, search, e.target.value, dateFrom, dateTo); }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-brand-400 focus:outline-none">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); fetchData(1, search, statusFilter, e.target.value, dateTo); }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-brand-400 focus:outline-none" />
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); fetchData(1, search, statusFilter, dateFrom, e.target.value); }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-brand-400 focus:outline-none" />
          {(search || statusFilter || dateFrom || dateTo) && (
            <button onClick={() => { setSearch(''); setStatusFilter(''); setDateFrom(''); setDateTo(''); fetchData(1, '', '', '', ''); }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50">Clear</button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
              <svg className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium">No volunteer applications found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead>
                    <tr className="bg-slate-50">
                      {['Volunteer', 'Email', 'LinkedIn', 'Resume', 'Status', 'Applied', 'Actions'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data?.data.map((v) => (
                      <tr key={v.id} className="hover:bg-brand-50 transition-colors">
                        <td className="px-5 py-4">
                          <a href={`/dashboard/admin/volunteers/${v.id}`} className="flex items-center gap-3 group">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-xs font-bold text-white">
                              {v.firstName[0]}{v.lastName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-600">{v.firstName} {v.lastName}</p>
                              <p className="text-xs text-slate-400">ZIP {v.zipcode}</p>
                            </div>
                          </a>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{v.email || <span className="text-slate-300">—</span>}</td>
                        <td className="px-5 py-4">
                          <a href={`https://linkedin.com/in/${v.linkedinName}`} target="_blank" rel="noreferrer"
                            className="text-sm text-brand-600 hover:underline">{v.linkedinName}</a>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="max-w-[140px] truncate text-xs font-medium text-slate-700">{v.resumeFileName}</p>
                            <p className="text-xs text-slate-400">{fmtBytes(v.resumeFileSizeBytes)}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[v.status]}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${v.status === 'PENDING' ? 'bg-amber-500' : v.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {v.status.charAt(0) + v.status.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500">{fmtDate(v.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <a
                              href={`/dashboard/admin/volunteers/${v.id}`}
                              className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors"
                            >
                              View Details
                            </a>
                            {v.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => setActionDialog({ id: v.id, name: `${v.firstName} ${v.lastName}`, action: 'APPROVED' })}
                                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                                  Approve
                                </button>
                                <button
                                  onClick={() => { setActionDialog({ id: v.id, name: `${v.firstName} ${v.lastName}`, action: 'REJECTED' }); setRejection(''); }}
                                  className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600">
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                  <p className="text-xs text-slate-500">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.total)} of {data.total}
                  </p>
                  <div className="flex gap-1">
                    <button onClick={() => goPage(page - 1)} disabled={page === 1}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40">← Prev</button>
                    {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(page - 2, data.totalPages - 4)) + i;
                      return (
                        <button key={p} onClick={() => goPage(p)}
                          className={`rounded-lg border px-3 py-1.5 text-xs ${p === page ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                          {p}
                        </button>
                      );
                    })}
                    <button onClick={() => goPage(page + 1)} disabled={page === data.totalPages}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40">Next →</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Approve/Reject Modal */}
      {actionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {actionDialog.action === 'APPROVED' ? (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-1 text-base font-bold text-slate-900">Approve Volunteer?</h3>
                <p className="mb-5 text-sm text-slate-500">
                  <strong>{actionDialog.name}</strong> will be approved and automatically emailed a confirmation.
                </p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setActionDialog(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button onClick={handleAction} disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                    {saving && <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                    {saving ? 'Approving…' : 'Approve & Email'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-1 text-base font-bold text-slate-900">Reject Application?</h3>
                <p className="mb-4 text-sm text-slate-500">
                  <strong>{actionDialog.name}</strong> will be rejected and emailed with your reason.
                </p>
                <div className="mb-4">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Reason for Rejection <span className="text-red-500">*</span></label>
                  <textarea
                    value={rejection}
                    onChange={(e) => setRejection(e.target.value)}
                    rows={3}
                    placeholder="Explain why the application is being rejected…"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setActionDialog(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button onClick={handleAction} disabled={saving || !rejection.trim()}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                    {saving && <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                    {saving ? 'Rejecting…' : 'Reject & Email'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
