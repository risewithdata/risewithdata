'use client';

import { useState, useEffect } from 'react';
import { InstructorLayout } from '@features/instructor/components/InstructorLayout';

interface Course {
  id: string;
  name: string;
}

interface Material {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description?: string;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fileIcon(fileType: string) {
  if (fileType.includes('pdf')) return 'PDF';
  if (fileType.includes('sheet') || fileType.includes('csv') || fileType.includes('excel')) return 'XLS';
  if (fileType.includes('word') || fileType.includes('doc')) return 'DOC';
  if (fileType.includes('image') || fileType.includes('png') || fileType.includes('jpg')) return 'IMG';
  if (fileType.includes('video') || fileType.includes('mp4')) return 'VID';
  if (fileType.includes('zip') || fileType.includes('archive')) return 'ZIP';
  return 'FILE';
}

function fileColor(fileType: string) {
  if (fileType.includes('pdf')) return 'bg-red-100 text-red-700';
  if (fileType.includes('sheet') || fileType.includes('csv') || fileType.includes('excel')) return 'bg-emerald-100 text-emerald-700';
  if (fileType.includes('word') || fileType.includes('doc')) return 'bg-blue-100 text-blue-700';
  if (fileType.includes('image') || fileType.includes('png') || fileType.includes('jpg')) return 'bg-violet-100 text-violet-700';
  if (fileType.includes('video') || fileType.includes('mp4')) return 'bg-pink-100 text-pink-700';
  return 'bg-slate-100 text-slate-600';
}

const emptyForm = { courseId: '', courseName: '', title: '', description: '', fileName: '', fileType: 'application/pdf' };

export default function InstructorMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
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
      fetch('/api/instructor/materials').then((r) => r.json()),
      fetch('/api/instructor/courses').then((r) => r.json()),
    ])
      .then(([matsRes, coursesRes]) => {
        if (matsRes.error) throw new Error(matsRes.error);
        if (coursesRes.error) throw new Error(coursesRes.error);
        setMaterials(matsRes.data);
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
    if (!form.courseId || !form.title || !form.fileName || !form.fileType) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/instructor/materials', {
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

  const deleteMaterial = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/instructor/materials?id=${id}`, { method: 'DELETE' });
    setDeleting(null);
    load();
  };

  return (
    <InstructorLayout>
      <div className="px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Course Materials</h1>
            <p className="mt-1 text-sm text-slate-500">{materials.length} material{materials.length !== 1 ? 's' : ''} uploaded</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setForm(emptyForm); setFormError(''); }}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Material
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        )}

        {!loading && materials.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <svg className="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700">No materials yet</h2>
            <p className="mt-2 max-w-xs text-sm text-slate-400">Upload lecture notes, slides, and resources for your students.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Add First Material
            </button>
          </div>
        )}

        {!loading && materials.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((mat) => (
              <div key={mat.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-brand-200">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${fileColor(mat.fileType)}`}>
                    {fileIcon(mat.fileType)}
                  </div>
                  <button
                    onClick={() => deleteMaterial(mat.id)}
                    disabled={deleting === mat.id}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-400 disabled:opacity-40"
                  >
                    {deleting === mat.id ? (
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
                <h3 className="font-semibold text-slate-800 leading-snug">{mat.title}</h3>
                {mat.description && <p className="mt-1 text-xs text-slate-500 line-clamp-2">{mat.description}</p>}
                <div className="mt-auto pt-3 space-y-1">
                  <p className="text-xs text-slate-400 truncate">{mat.fileName}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 truncate max-w-[60%]">
                      {mat.courseName}
                    </span>
                    <span className="text-xs text-slate-400">{fmtDate(mat.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Material Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add Course Material</h2>
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
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Title <span className="text-red-500">*</span></label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Week 1 Slides"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Brief description of this material…"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">File Name <span className="text-red-500">*</span></label>
                <input
                  value={form.fileName}
                  onChange={(e) => setForm((f) => ({ ...f, fileName: e.target.value }))}
                  placeholder="e.g. week1-intro.pdf"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">File Type <span className="text-red-500">*</span></label>
                <select
                  value={form.fileType}
                  onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-200 focus:bg-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="application/pdf">PDF</option>
                  <option value="application/vnd.ms-excel">Excel / CSV</option>
                  <option value="application/msword">Word Document</option>
                  <option value="image/png">Image</option>
                  <option value="video/mp4">Video</option>
                  <option value="application/zip">ZIP Archive</option>
                  <option value="text/plain">Text File</option>
                </select>
              </div>
            </div>

            {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}

            <div className="mt-5 flex gap-3">
              <button
                onClick={submit}
                disabled={saving}
                className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Add Material'}
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
