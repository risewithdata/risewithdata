'use client';

import { useState, useEffect, use } from 'react';
import { StudentLayout } from '@features/student/components/StudentLayout';

interface CourseDetail {
  id: string;
  name: string;
  trainerName: string;
  duration: string;
  startDate: string;
  endDate: string;
  seatsAvailable: number;
  applicationsReceived: number;
  status: 'ACTIVE' | 'INACTIVE';
  enrolledAt: string;
  applicationId: string;
  firstName: string;
  lastName: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function courseProgress(startDate: string, endDate: string) {
  const now   = Date.now();
  const start = new Date(startDate).getTime();
  const end   = new Date(endDate).getTime();
  if (now < start) return { label: 'Upcoming', pct: 0, bg: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' };
  if (now > end)   return { label: 'Completed', pct: 100, bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' };
  const pct = Math.round(((now - start) / (end - start)) * 100);
  return { label: 'In Progress', pct, bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' };
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }   = use(params);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch(`/api/student/courses/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setCourse(j.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <StudentLayout>
      <div className="px-6 py-8">

        {/* Back */}
        <a
          href="/dashboard/student/courses"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Courses
        </a>

        {loading && (
          <div className="space-y-4">
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {!loading && course && (() => {
          const prog = courseProgress(course.startDate, course.endDate);
          return (
            <div className="space-y-6">

              {/* Hero card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-6 py-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${prog.badge} mb-3`}>
                        {prog.label}
                      </span>
                      <h1 className="text-xl font-bold text-white sm:text-2xl">{course.name}</h1>
                      <p className="mt-1 text-sm text-blue-300">Trainer: {course.trainerName}</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-6">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-blue-200">
                      <span>Course Progress</span>
                      <span className="font-semibold text-white">{prog.pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                      <div className={`h-full rounded-full ${prog.bg} transition-all duration-700`} style={{ width: `${prog.pct}%` }} />
                    </div>
                  </div>
                </div>

                {/* Enrollment badge */}
                <div className="flex items-center gap-2 border-t border-slate-100 bg-emerald-50 px-6 py-3">
                  <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-emerald-700">
                    Enrolled on {fmtDate(course.enrolledAt)}
                  </p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard
                  icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  label="Duration"
                  value={course.duration}
                />
                <InfoCard
                  icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  label="Start Date"
                  value={fmtDate(course.startDate)}
                />
                <InfoCard
                  icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  label="End Date"
                  value={fmtDate(course.endDate)}
                />
                <InfoCard
                  icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  label="Seats Available"
                  value={String(course.seatsAvailable)}
                />
              </div>

              {/* Two column */}
              <div className="grid gap-6 lg:grid-cols-2">

                {/* Trainer card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Trainer
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-lg font-bold text-white">
                      {course.trainerName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">{course.trainerName}</p>
                      <p className="text-sm text-slate-500">Course Instructor</p>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course status */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Enrollment Details
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Enrollment Status</span>
                      <span className="font-semibold text-emerald-600">✓ Enrolled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Enrolled On</span>
                      <span className="font-medium text-slate-700">{fmtDate(course.enrolledAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Course Status</span>
                      <span className={`font-semibold ${course.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {course.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Applications Received</span>
                      <span className="font-medium text-slate-700">{course.applicationsReceived}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })()}
      </div>
    </StudentLayout>
  );
}
