'use client';

import { useState, useEffect, useCallback } from 'react';

interface Certificate {
  id: string;
  certificateNumber: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  trainerName: string;
  issuedDate: string;
  status: 'ACTIVE' | 'REVOKED';
}

interface Student {
  firstName: string;
  lastName: string;
  email: string;
  courseApplied: string;
  trainer: string;
}

const EMPTY_FORM = {
  studentEmail: '',
  studentName: '',
  courseName: '',
  trainerName: '',
  issuedDate: new Date().toISOString().slice(0, 10),
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminCertificatesPage() {
  const [certs, setCerts]           = useState<Certificate[]>([]);
  const [students, setStudents]     = useState<Student[]>([]);
  const [loading, setLoading]       = useState(true);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState('');
  const [generatedNum, setGeneratedNum] = useState('');

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/certificates');
    const j   = await res.json();
    setCerts(j.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCerts();
    // Load approved students
    fetch('/api/admin/applications?status=APPROVED&pageSize=200')
      .then(r => r.json())
      .then(j => setStudents((j.data ?? []).map((s: Record<string, unknown>) => ({
        firstName:    s.firstName,
        lastName:     s.lastName,
        email:        s.email,
        courseApplied: s.courseApplied,
        trainer:      s.trainer ?? s.trainerName ?? '',
      }))));
  }, [fetchCerts]);

  const handleStudentSelect = (email: string) => {
    const s = students.find(st => st.email === email);
    if (!s) return;
    setForm(f => ({
      ...f,
      studentEmail: s.email,
      studentName:  `${s.firstName} ${s.lastName}`,
      courseName:   s.courseApplied ?? '',
      trainerName:  s.trainer ?? '',
    }));
  };

  const handleSave = async () => {
    if (!form.studentName || !form.studentEmail || !form.courseName || !form.issuedDate) return;
    setSaving(true);
    setSaveError('');
    setGeneratedNum('');
    try {
      const res = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? 'Failed to issue');
      setGeneratedNum(j.certificateNumber);
      setForm(EMPTY_FORM);
      fetchCerts();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to issue certificate');
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (cert: Certificate) => {
    if (!confirm(`Revoke certificate ${cert.certificateNumber}?`)) return;
    await fetch(`/api/admin/certificates/${cert.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: cert.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE' }),
    });
    fetchCerts();
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
          <nav className="flex items-center gap-1 flex-wrap">
            <a href="/dashboard/admin"              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Dashboard</a>
            <a href="/dashboard/admin/applications" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Student Apps</a>
            <a href="/dashboard/admin/courses"      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Courses</a>
            <a href="/dashboard/admin/students"     className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Students</a>
            <a href="/dashboard/admin/certificates" className="rounded-lg bg-brand-100 px-3 py-2 text-sm font-medium text-brand-700">Certificates</a>
            <a href="/dashboard/admin/payments"     className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Payments</a>
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
          <h1 className="text-2xl font-bold text-slate-900">Certificates</h1>
          <p className="mt-0.5 text-sm text-slate-500">Issue and manage student completion certificates</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Issue Certificate Form */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-500">Issue New Certificate</h2>

              {generatedNum && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-semibold text-emerald-700">Certificate issued!</p>
                  <p className="mt-1 text-sm font-bold text-emerald-800">{generatedNum}</p>
                </div>
              )}
              {saveError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</div>
              )}

              {/* Student selector */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Select Approved Student</label>
                <select
                  onChange={e => handleStudentSelect(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
                >
                  <option value="">— choose a student —</option>
                  {students.map((s, i) => (
                    <option key={`${s.email}-${i}`} value={s.email}>
                      {s.firstName} {s.lastName} ({s.courseApplied})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Student Name</label>
                <input value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-200" />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Student Email</label>
                <input value={form.studentEmail} onChange={e => setForm(f => ({ ...f, studentEmail: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-200" />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Course</label>
                <input value={form.courseName} onChange={e => setForm(f => ({ ...f, courseName: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-200" />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Trainer Name</label>
                <input value={form.trainerName} onChange={e => setForm(f => ({ ...f, trainerName: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-200" />
              </div>

              <div className="mb-5">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Issue Date</label>
                <input type="date" value={form.issuedDate} onChange={e => setForm(f => ({ ...f, issuedDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-200" />
              </div>

              <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                Certificate number will be auto-generated:<br />
                <span className="font-mono font-semibold text-slate-700">
                  RWD-{form.courseName ? (
                    { Starter: 'STR', Core: 'COR', Advanced: 'ADV', Elite: 'ELT',
                      'Cohort Lincoln': 'LIN', 'Cohort Washington': 'WAS' }[form.courseName]
                    ?? form.courseName.slice(0,3).toUpperCase()
                  ) : '???'}-{form.issuedDate?.slice(0,4) ?? '????'}-####
                </span>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !form.studentName || !form.studentEmail || !form.courseName || !form.issuedDate}
                className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {saving ? 'Issuing…' : 'Issue Certificate'}
              </button>
            </div>
          </div>

          {/* Certificates List */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Issued Certificates ({certs.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      {['Certificate No', 'Student', 'Course', 'Issued', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j} className="px-4 py-3"><div className="h-4 animate-pulse rounded bg-slate-100" /></td>
                          ))}
                        </tr>
                      ))
                    ) : certs.length === 0 ? (
                      <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400">No certificates issued yet</td></tr>
                    ) : certs.map(cert => (
                      <tr key={cert.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-brand-700">{cert.certificateNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{cert.studentName}</p>
                          <p className="text-xs text-slate-400">{cert.studentEmail}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{cert.courseName}</td>
                        <td className="px-4 py-3 text-slate-600">{fmtDate(cert.issuedDate)}</td>
                        <td className="px-4 py-3">
                          {cert.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />Revoked
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleRevoke(cert)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                              cert.status === 'ACTIVE'
                                ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                          >
                            {cert.status === 'ACTIVE' ? 'Revoke' : 'Restore'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
