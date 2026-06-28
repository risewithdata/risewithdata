'use client';

import { useState, useEffect } from 'react';
import { InstructorLayout } from '@features/instructor/components/InstructorLayout';

interface ProgressItem {
  id: string;
  name: string;
  duration: string;
  status: 'ACTIVE' | 'INACTIVE';
  startDate: string;
  endDate: string;
  totalStudents: number;
  progressPct: number;
  progressLabel: 'Upcoming' | 'In Progress' | 'Completed';
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function progressColor(label: string) {
  if (label === 'Completed') return { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-700' };
  if (label === 'In Progress') return { bar: 'bg-brand-500', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-700' };
  return { bar: 'bg-slate-300', badge: 'bg-brand-100 text-brand-700', text: 'text-brand-700' };
}

export default function InstructorProgressPage() {
  const [items, setItems] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/instructor/progress')
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setItems(j.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const completed = items.filter((i) => i.progressLabel === 'Completed').length;
  const inProgress = items.filter((i) => i.progressLabel === 'In Progress').length;
  const upcoming = items.filter((i) => i.progressLabel === 'Upcoming').length;

  return (
    <InstructorLayout>
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Course Progress</h1>
          <p className="mt-1 text-sm text-slate-500">Track the progress of all your courses</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <svg className="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700">No courses to track</h2>
            <p className="mt-2 max-w-xs text-sm text-slate-400">Courses assigned to you will show progress here.</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="space-y-5">
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-brand-600">{upcoming}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">Upcoming</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-amber-600">{inProgress}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">In Progress</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-emerald-600">{completed}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">Completed</p>
              </div>
            </div>

            {/* Course progress cards */}
            {items.map((item) => {
              const colors = progressColor(item.progressLabel);
              return (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-900">{item.name}</h2>
                      <p className="mt-0.5 text-sm text-slate-500">{item.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors.badge}`}>
                        {item.progressLabel}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Progress</span>
                      <span className={`font-semibold ${colors.text}`}>{item.progressPct}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${colors.bar}`}
                        style={{ width: `${item.progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                      <p className="text-xs text-slate-400">Start</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-700">{fmtDate(item.startDate)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                      <p className="text-xs text-slate-400">End</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-700">{fmtDate(item.endDate)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                      <p className="text-xs text-slate-400">Students</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-700">{item.totalStudents}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
