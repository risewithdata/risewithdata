'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Status = 'ACTIVE' | 'INACTIVE';

interface Course {
  id: string;
  name: string;
  trainerName: string;
  duration: string;
  startDate: string;
  endDate: string;
  seatsAvailable: number;
  applicationsReceived: number;
  status: Status;
  createdAt: string;
}

interface ApiResponse {
  data: Course[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: { total: number; ACTIVE: number; INACTIVE: number };
  trainers: string[];
}

interface ConfirmDialog {
  type: 'delete' | 'toggle';
  course: Course;
}

interface EditModal {
  course: Course | null; // null = new course
}

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'name',       label: 'Course Name' },
  { value: 'startDate',  label: 'Start Date' },
  { value: 'endDate',    label: 'End Date' },
  { value: 'seatsAvailable', label: 'Seats' },
];

function StatusBadge({ status }: { status: Status }) {
  return status === 'ACTIVE' ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Inactive
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${50 + (i * 17) % 45}%` }} />
        </td>
      ))}
    </tr>
  );
}

const EMPTY_FORM = { name: '', trainerName: '', duration: '', startDate: '', endDate: '', seatsAvailable: 0 };

function toInputDate(iso: string) {
  return iso ? iso.slice(0, 10) : '';
}

export default function AdminCoursesPage() {
  const [data, setData]             = useState<Course[]>([]);
  const [stats, setStats]           = useState({ total: 0, ACTIVE: 0, INACTIVE: 0 });
  const [trainers, setTrainers]     = useState<string[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);

  const [search,        setSearch]        = useState('');
  const [trainerFilter, setTrainerFilter] = useState('');
  const [statusFilter,  setStatusFilter]  = useState('');
  const [sortBy,        setSortBy]        = useState('createdAt');
  const [sortDir,       setSortDir]       = useState<'asc' | 'desc'>('desc');

  const [confirm,       setConfirm]       = useState<ConfirmDialog | null>(null);
  const [editModal,     setEditModal]     = useState<EditModal | null>(null);
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [formLoading,   setFormLoading]   = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const searchRef    = useRef<ReturnType<typeof setTimeout>>();
  const isFirstRender = useRef(true);

  const fetchData = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError('');
    try {
      const p = new URLSearchParams({
        search, trainer: trainerFilter, status: statusFilter,
        sortBy, sortDir, page: String(currentPage), pageSize: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/admin/courses?${p}`);
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error ?? `Error ${res.status}`); }
      const json: ApiResponse = await res.json();
      setData(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);
      setStats(json.stats);
      setTrainers(json.trainers);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [search, trainerFilter, statusFilter, sortBy, sortDir]);

  useEffect(() => {
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => { setPage(1); fetchData(1); }, search ? 300 : 0);
    return () => clearTimeout(searchRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, trainerFilter, statusFilter, sortBy, sortDir]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    fetchData(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openEdit = (course: Course | null) => {
    setForm(course ? {
      name: course.name, trainerName: course.trainerName, duration: course.duration,
      startDate: toInputDate(course.startDate), endDate: toInputDate(course.endDate),
      seatsAvailable: course.seatsAvailable,
    } : EMPTY_FORM);
    setEditModal({ course });
  };

  const handleSave = async () => {
    if (!form.name || !form.trainerName || !form.duration || !form.startDate || !form.endDate) return;
    setFormLoading(true);
    try {
      const isEdit = !!editModal?.course;
      const url    = isEdit ? `/api/admin/courses/${editModal!.course!.id}` : '/api/admin/courses';
      const res    = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Save failed');
      setEditModal(null);
      fetchData(page);
    } catch {
      alert('Failed to save course');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    setActionLoading(true);
    try {
      if (confirm.type === 'delete') {
        await fetch(`/api/admin/courses/${confirm.course.id}`, { method: 'DELETE' });
      } else {
        await fetch(`/api/admin/courses/${confirm.course.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toggleStatus: true }),
        });
      }
      setConfirm(null);
      fetchData(page);
    } finally {
      setActionLoading(false);
    }
  };

  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const toggleSort = (field: string) => {
    if (sortBy === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };
  const SortIcon = ({ field }: { field: string }) => sortBy !== field ? (
    <svg className="ml-1 h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v8m0 0l4-4m-4 4l-4-4" /></svg>
  ) : sortDir === 'desc' ? (
    <svg className="ml-1 h-3 w-3 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
  ) : (
    <svg className="ml-1 h-3 w-3 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <a href="/"><img src="/logo.jpeg" alt="RiseWithData" className="h-14 w-auto mix-blend-multiply" /></a>
            <span className="hidden rounded-md bg-brand-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 sm:block">Admin</span>
          </div>
          <nav className="flex items-center gap-1">
            <a href="/dashboard/admin"              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Dashboard</a>
            <a href="/dashboard/admin/applications" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Applications</a>
            <a href="/dashboard/admin/courses"      className="rounded-lg bg-brand-100 px-3 py-2 text-sm font-medium text-brand-700">Courses</a>
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

        {/* ── Heading ── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
            <p className="mt-0.5 text-sm text-slate-500">{total} total courses</p>
          </div>
          <button
            onClick={() => openEdit(null)}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Course
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Total',    value: stats.total,    color: 'text-slate-700',   bg: 'bg-white',      border: 'border-slate-200' },
            { label: 'Active',   value: stats.ACTIVE,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Inactive', value: stats.INACTIVE, color: 'text-slate-500',   bg: 'bg-slate-50',   border: 'border-slate-200' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border ${s.border} ${s.bg} px-5 py-4 shadow-sm`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
              <p className={`mt-1.5 text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or trainer…" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand-200 focus:ring-2 focus:ring-brand-500" />
          </div>

          <select value={trainerFilter} onChange={(e) => { setTrainerFilter(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-200">
            <option value="">All Trainers</option>
            {trainers.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-200">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select value={`${sortBy}:${sortDir}`} onChange={(e) => { const [f, d] = e.target.value.split(':'); setSortBy(f); setSortDir(d as 'asc' | 'desc'); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-200">
            {SORT_OPTIONS.map((o) => (
              <optgroup key={o.value} label={o.label}>
                <option value={`${o.value}:desc`}>{o.label} (Newest)</option>
                <option value={`${o.value}:asc`}>{o.label} (Oldest)</option>
              </optgroup>
            ))}
          </select>

          {(search || trainerFilter || statusFilter) && (
            <button onClick={() => { setSearch(''); setTrainerFilter(''); setStatusFilter(''); setPage(1); }} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Clear
            </button>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {error}
            <button onClick={() => fetchData(page)} className="ml-auto text-xs font-semibold underline">Retry</button>
          </div>
        )}

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-sm">
              <thead>
                <tr className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
                  {[
                    { label: 'Course Name',    field: 'name' },
                    { label: 'Trainer',        field: 'trainerName' },
                    { label: 'Duration',       field: null },
                    { label: 'Start Date',     field: 'startDate' },
                    { label: 'End Date',       field: 'endDate' },
                    { label: 'Seats',          field: 'seatsAvailable' },
                    { label: 'Applications',   field: null },
                    { label: 'Status',         field: null },
                    { label: 'Actions',        field: null },
                  ].map(({ label, field }) => (
                    <th key={label} onClick={field ? () => toggleSort(field) : undefined}
                      className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 ${field ? 'cursor-pointer select-none hover:text-slate-700' : ''}`}>
                      <span className="flex items-center">
                        {label}{field && <SortIcon field={field} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonRow key={i} />)
                ) : data.length === 0 ? (
                  <tr><td colSpan={9} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      </div>
                      <p className="font-semibold text-slate-700">No courses found</p>
                      <p className="text-sm text-slate-400">Try adjusting your filters or add a new course</p>
                    </div>
                  </td></tr>
                ) : data.map((course) => {
                  const filled = Math.min(100, Math.round((course.applicationsReceived / Math.max(1, course.seatsAvailable)) * 100));
                  return (
                    <tr key={course.id} className="group border-b border-slate-100 transition hover:bg-brand-50">
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-800 max-w-[220px] truncate" title={course.name}>{course.name}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                            {course.trainerName.split(' ').map(w => w[0]).join('')}
                          </div>
                          <span className="text-slate-700">{course.trainerName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{course.duration}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{fmtDate(course.startDate)}</td>
                      <td className="px-4 py-3.5 text-slate-600">{fmtDate(course.endDate)}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-slate-800">{course.seatsAvailable}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                            <div className={`h-full rounded-full ${filled >= 90 ? 'bg-red-500' : filled >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${filled}%` }} />
                          </div>
                          <span className="text-sm text-slate-600">{course.applicationsReceived}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={course.status} /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {/* Edit */}
                          <Tip label="Edit">
                            <button onClick={() => openEdit(course)} className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                          </Tip>
                          {/* Toggle */}
                          <Tip label={course.status === 'ACTIVE' ? 'Disable' : 'Enable'}>
                            <button onClick={() => setConfirm({ type: 'toggle', course })} className={`rounded-lg border p-1.5 ${course.status === 'ACTIVE' ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100' : 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                              {course.status === 'ACTIVE' ? (
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                              ) : (
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              )}
                            </button>
                          </Tip>
                          {/* View Applications */}
                          <Tip label="View Applications">
                            <a href={`/dashboard/admin/applications?course=${encodeURIComponent(course.name)}`} className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </a>
                          </Tip>
                          {/* Delete */}
                          <Tip label="Delete">
                            <button onClick={() => setConfirm({ type: 'delete', course })} className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-500 hover:bg-red-100">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </Tip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <p className="text-sm text-slate-500">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(1)} disabled={page === 1} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs disabled:opacity-40 hover:bg-slate-50">«</button>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-slate-50">Prev</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const pg = start + i;
                  return (
                    <button key={pg} onClick={() => setPage(pg)} className={`rounded-lg border px-3 py-1.5 text-xs ${pg === page ? 'border-brand-200 bg-brand-600 text-white' : 'border-slate-200 hover:bg-slate-50'}`}>{pg}</button>
                  );
                })}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-slate-50">Next</button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs disabled:opacity-40 hover:bg-slate-50">»</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Confirm Dialog ── */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${confirm.type === 'delete' ? 'bg-red-100' : confirm.course.status === 'ACTIVE' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
              {confirm.type === 'delete' ? (
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              ) : confirm.course.status === 'ACTIVE' ? (
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              ) : (
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900">
              {confirm.type === 'delete' ? 'Delete Course' : confirm.course.status === 'ACTIVE' ? 'Disable Course' : 'Enable Course'}
            </h3>
            <p className="mt-2 text-center text-sm text-slate-500">
              {confirm.type === 'delete'
                ? <>Are you sure you want to permanently delete <strong>{confirm.course.name}</strong>? This cannot be undone.</>
                : <>Are you sure you want to {confirm.course.status === 'ACTIVE' ? 'disable' : 'enable'} <strong>{confirm.course.name}</strong>?</>
              }
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleConfirm} disabled={actionLoading}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${confirm.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : confirm.course.status === 'ACTIVE' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                {actionLoading ? 'Processing…' : confirm.type === 'delete' ? 'Delete' : confirm.course.status === 'ACTIVE' ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit / Add Modal ── */}
      {editModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">{editModal.course ? 'Edit Course' : 'Add New Course'}</h3>
              <button onClick={() => setEditModal(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Course Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-200 focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Trainer Name <span className="text-red-500">*</span></label>
                  <input value={form.trainerName} onChange={(e) => setForm({ ...form, trainerName: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-200 focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Duration <span className="text-red-500">*</span></label>
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 8 weeks" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-200 focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-200 focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">End Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-200 focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Seats Available</label>
                <input type="number" min={0} value={form.seatsAvailable} onChange={(e) => setForm({ ...form, seatsAvailable: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-200 focus:ring-2 focus:ring-brand-500" />
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={() => setEditModal(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={formLoading || !form.name || !form.trainerName || !form.duration || !form.startDate || !form.endDate}
                className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
                {formLoading ? 'Saving…' : editModal.course ? 'Save Changes' : 'Add Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group/tip relative">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition group-hover/tip:opacity-100">
        {label}
      </div>
    </div>
  );
}
