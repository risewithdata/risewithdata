'use client';

import { useState, useEffect, use } from 'react';
import { InstructorLayout } from '@features/instructor/components/InstructorLayout';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  courseApplied: string;
  createdAt: string;
}

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
  createdAt: string;
  students: Student[];
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function courseProgress(startDate: string, endDate: string) {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now < start) return { label: 'Upcoming', pct: 0 };
  if (now > end) return { label: 'Completed', pct: 100 };
  const pct = Math.round(((now - start) / (end - start)) * 100);
  return { label: 'In Progress', pct };
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/instructor/courses/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setCourse(j.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const prog = course ? courseProgress(course.startDate, course.endDate) : null;

  return (
    <InstructorLayout>
      <div className="px-6 py-8">
        <div className="mb-6">
          <a href="/dashboard/instructor/courses" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </a>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading && (
          <div className="space-y-5">
            <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        )}

        {!loading && course && (
          <div className="space-y-6">
            {/* Hero card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">{course.name}</h1>
                    <p className="mt-1 text-sm text-slate-500">Trainer: {course.trainerName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    prog?.label === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    prog?.label === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-brand-100 text-brand-700'
                  }`}>
                    {prog?.label}
                  </span>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    course.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {course.status}
                  </span>
                </div>
              </div>

              {prog && prog.label === 'In Progress' && (
                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                    <span>Course Progress</span>
                    <span className="font-medium text-slate-600">{prog.pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${prog.pct}%` }} />
                  </div>
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Duration</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{course.duration}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Start Date</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{fmtDate(course.startDate)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">End Date</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{fmtDate(course.endDate)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Enrolled Students</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{course.students.length}</p>
                </div>
              </div>
            </div>

            {/* Enrolled students */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-sm font-bold text-slate-800">
                  Enrolled Students ({course.students.length})
                </h2>
              </div>
              {course.students.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-slate-400">
                  No students enrolled in this course yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {course.students.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                                {student.firstName[0]}{student.lastName[0]}
                              </div>
                              <span className="text-sm font-medium text-slate-800">{student.firstName} {student.lastName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{fmtShort(student.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
