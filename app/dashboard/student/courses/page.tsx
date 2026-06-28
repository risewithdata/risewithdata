'use client';

import { useState, useEffect } from 'react';
import { StudentLayout } from '@features/student/components/StudentLayout';

interface Course {
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
}

function courseProgress(startDate: string, endDate: string) {
  const now   = Date.now();
  const start = new Date(startDate).getTime();
  const end   = new Date(endDate).getTime();
  if (now < start) return { label: 'Upcoming', pct: 0, color: 'bg-brand-500' };
  if (now > end)   return { label: 'Completed', pct: 100, color: 'bg-emerald-500' };
  const pct = Math.round(((now - start) / (end - start)) * 100);
  return { label: 'In Progress', pct, color: 'bg-amber-500' };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch('/api/student/courses')
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setCourses(j.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <StudentLayout>
      <div className="px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? 'Loading…' : `${courses.length} enrolled course${courses.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <svg className="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700">No courses yet</h2>
            <p className="mt-2 max-w-xs text-sm text-slate-400">
              Once your application is approved, your enrolled courses will appear here.
            </p>
            <a href="/apply" className="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              Apply Now
            </a>
          </div>
        )}

        {/* Course grid */}
        {!loading && courses.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const prog = courseProgress(course.startDate, course.endDate);
              return (
                <div key={course.id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-brand-200">

                  {/* Card header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      prog.label === 'Completed'  ? 'bg-emerald-100 text-emerald-700' :
                      prog.label === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-brand-100 text-brand-700'
                    }`}>
                      {prog.label}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="mb-1 text-base font-bold text-slate-900 leading-snug group-hover:text-brand-700 transition-colors">
                      {course.name}
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">Trainer: {course.trainerName}</p>

                    {/* Progress bar */}
                    {prog.label === 'In Progress' && (
                      <div className="mb-4">
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                          <span>Progress</span>
                          <span className="font-medium text-slate-600">{prog.pct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${prog.color}`} style={{ width: `${prog.pct}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Meta */}
                    <div className="mt-auto space-y-2 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{fmtDate(course.startDate)} — {fmtDate(course.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-100 p-4">
                    <a
                      href={`/dashboard/student/courses/${course.id}`}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-50 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
                    >
                      View Details
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
