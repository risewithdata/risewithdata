'use client';

import { useState, useEffect } from 'react';
import { InstructorLayout } from '@features/instructor/components/InstructorLayout';

interface DashboardData {
  stats: {
    totalCourses: number;
    totalStudents: number;
    totalAnnouncements: number;
    totalMaterials: number;
  };
  recentStudents: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    courseApplied: string;
    createdAt: string;
  }[];
  upcomingSlots: {
    id: string;
    courseName: string;
    title: string;
    slotDate: string;
    startTime: string;
    endTime: string;
    location?: string;
  }[];
  recentAnnouncements: {
    id: string;
    courseName: string;
    title: string;
    body: string;
    createdAt: string;
  }[];
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function InstructorDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/instructor/dashboard')
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setData(j);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <InstructorLayout>
      <div className="px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Instructor Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Welcome back! Here's an overview of your teaching activity.</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <a
              href="/dashboard/instructor/schedule"
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Schedule
            </a>
            <a
              href="/dashboard/instructor/announcements"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Post Announcement
            </a>
            <a
              href="/dashboard/instructor/materials"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Upload Material
            </a>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
        )}

        {!loading && data && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Courses"
                value={data.stats.totalCourses}
                color="bg-brand-50"
                icon={
                  <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              />
              <StatCard
                label="Total Students"
                value={data.stats.totalStudents}
                color="bg-emerald-50"
                icon={
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Announcements"
                value={data.stats.totalAnnouncements}
                color="bg-amber-50"
                icon={
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                }
              />
              <StatCard
                label="Materials"
                value={data.stats.totalMaterials}
                color="bg-violet-50"
                icon={
                  <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                }
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {/* Recent students */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h2 className="text-sm font-bold text-slate-800">Recent Students</h2>
                  <a href="/dashboard/instructor/students" className="text-xs font-semibold text-brand-600 hover:text-brand-700">View all</a>
                </div>
                {data.recentStudents.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-slate-400">No students enrolled yet.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {data.recentStudents.map((s) => (
                      <div key={s.id} className="flex items-center gap-3 px-6 py-3.5">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">{s.firstName} {s.lastName}</p>
                          <p className="truncate text-xs text-slate-400">{s.courseApplied ?? '—'}</p>
                        </div>
                        <span className="flex-shrink-0 text-xs text-slate-400">{fmtDate(s.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming slots */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h2 className="text-sm font-bold text-slate-800">Upcoming Sessions</h2>
                  <a href="/dashboard/instructor/schedule" className="text-xs font-semibold text-brand-600 hover:text-brand-700">View all</a>
                </div>
                {data.upcomingSlots.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-slate-400">No upcoming sessions scheduled.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {data.upcomingSlots.map((slot) => (
                      <div key={slot.id} className="flex items-start gap-3 px-6 py-3.5">
                        <div className="flex h-9 w-9 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-center">
                          <span className="text-[10px] font-bold uppercase text-brand-600">
                            {new Date(slot.slotDate).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-sm font-bold text-brand-700">
                            {new Date(slot.slotDate).getDate()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">{slot.title}</p>
                          <p className="truncate text-xs text-slate-400">{slot.courseName} · {slot.startTime} – {slot.endTime}</p>
                          {slot.location && (
                            <p className="truncate text-xs text-slate-400">{slot.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent announcements */}
            {data.recentAnnouncements.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h2 className="text-sm font-bold text-slate-800">Recent Announcements</h2>
                  <a href="/dashboard/instructor/announcements" className="text-xs font-semibold text-brand-600 hover:text-brand-700">View all</a>
                </div>
                <div className="divide-y divide-slate-100">
                  {data.recentAnnouncements.map((ann) => (
                    <div key={ann.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{ann.title}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{ann.courseName}</p>
                          <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">{ann.body}</p>
                        </div>
                        <span className="flex-shrink-0 text-xs text-slate-400">{fmtDate(ann.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick actions (mobile) */}
            <div className="grid gap-3 sm:hidden">
              <a href="/dashboard/instructor/schedule" className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700">
                Add Schedule
              </a>
              <a href="/dashboard/instructor/announcements" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Post Announcement
              </a>
              <a href="/dashboard/instructor/materials" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Upload Material
              </a>
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
