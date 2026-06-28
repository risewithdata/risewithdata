'use client';

import { useState, useEffect } from 'react';
import { InstructorLayout } from '@features/instructor/components/InstructorLayout';

interface Course {
  id: string;
  name: string;
}

interface ScheduleSlot {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
  createdAt: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

const emptyForm = { courseId: '', courseName: '', title: '', slotDate: '', startTime: '', endTime: '', location: '', notes: '' };

export default function InstructorSchedulePage() {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/instructor/schedule').then((r) => r.json()),
      fetch('/api/instructor/courses').then((r) => r.json()),
    ])
      .then(([slotsRes, coursesRes]) => {
        if (slotsRes.error) throw new Error(slotsRes.error);
        if (coursesRes.error) throw new Error(coursesRes.error);
        setSlots(slotsRes.data);
        setCourses(coursesRes.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCourseChange = (courseId: string) => {
    const found = courses.find((c) => c.id === courseId);
    setForm((f) => ({ ...f, courseId, courseName: found?.name ?? '' }));
  };

  const submit = async () => {
    setFormError('');
    if (!form.courseId || !form.title || !form.slotDate || !form.startTime || !form.endTime) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/instructor/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { setFormError(json.error ?? 'Failed to save.'); return; }
    setShowModal(false);
    setForm(emptyForm);
    load();
  };

  const deleteSlot = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/instructor/schedule?id=${id}`, { method: 'DELETE' });
    setDeleting(null);
    load();
  };

  const upcoming = slots.filter((s) => new Date(s.slotDate) >= new Date());
  const past = slots.filter((s) => new Date(s.slotDate) < new Date());

  return (
    <InstructorLayout>
      <div className="px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
            <p className="mt-1 text-sm text-slate-500">{slots.length} session{slots.length !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setForm(emptyForm); setFormError(''); }}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Session
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        )}

        {!loading && slots.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <svg className="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700">No sessions yet</h2>
            <p className="mt-2 max-w-xs text-sm text-slate-400">Add schedule sessions to keep your students informed.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Add First Session
            </button>
          </div>
        )}

        {!loading && slots.length > 0 && (
          <div className="space-y-6">
            {upcoming.length > 0 && (
              <div>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Upcoming</h2>
                <div className="space-y-3">
                  {upcoming.map((slot) => (
                    <SlotCard key={slot.id} slot={slot} onDelete={deleteSlot} deleting={deleting === slot.id} />
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Past</h2>
                <div className="space-y-3">
                  {past.map((slot) => (
                    <SlotCard key={slot.id} slot={slot} onDelete={deleteSlot} deleting={deleting === slot.id} past />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add Schedule Session</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Course <span className="text-red-500">*</span></label>
                <select
                  value={form.courseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select a course…</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Session Title <span className="text-red-500">*</span></label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Week 1 — Introduction"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={form.slotDate}
                  onChange={(e) => setForm((f) => ({ ...f, slotDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Start Time <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">End Time <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Zoom, Room 101, Google Meet…"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  placeholder="Additional notes for students…"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {formError && (
              <p className="mt-3 text-sm text-red-600">{formError}</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={submit}
                disabled={saving}
                className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Add Session'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </InstructorLayout>
  );
}

function SlotCard({ slot, onDelete, deleting, past }: {
  slot: ScheduleSlot;
  onDelete: (id: string) => void;
  deleting: boolean;
  past?: boolean;
}) {
  return (
    <div className={`flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm transition ${past ? 'border-slate-100 opacity-60' : 'border-slate-200'}`}>
      <div className={`flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl text-center ${past ? 'bg-slate-100' : 'bg-brand-50'}`}>
        <span className={`text-[10px] font-bold uppercase ${past ? 'text-slate-400' : 'text-brand-600'}`}>
          {new Date(slot.slotDate).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className={`text-lg font-bold leading-none ${past ? 'text-slate-500' : 'text-brand-700'}`}>
          {new Date(slot.slotDate).getDate()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800">{slot.title}</p>
        <p className="mt-0.5 text-sm text-slate-500">{slot.courseName}</p>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <span>{slot.startTime} – {slot.endTime}</span>
          {slot.location && <span>{slot.location}</span>}
        </div>
        {slot.notes && <p className="mt-1 text-xs text-slate-500 line-clamp-2">{slot.notes}</p>}
      </div>
      <button
        onClick={() => onDelete(slot.id)}
        disabled={deleting}
        className="ml-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
      >
        {deleting ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>
    </div>
  );
}
