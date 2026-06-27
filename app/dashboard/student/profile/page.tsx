'use client';

import { useState, useEffect } from 'react';
import { StudentLayout } from '@features/student/components/StudentLayout';

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  applications: {
    id: string;
    courseApplied: string | null;
    trainer: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

const STATUS_BADGE: Record<string, string> = {
  APPROVED: 'bg-emerald-100 text-emerald-700',
  PENDING:  'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function ProfilePage() {
  const [profile,    setProfile]    = useState<ProfileData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  // Name edit
  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [saving,     setSaving]     = useState(false);
  const [saveMsg,    setSaveMsg]    = useState('');

  // Password
  const [curPass,    setCurPass]    = useState('');
  const [newPass,    setNewPass]    = useState('');
  const [confPass,   setConfPass]   = useState('');
  const [passMsg,    setPassMsg]    = useState('');
  const [passSaving, setPassSaving] = useState(false);
  const [passError,  setPassError]  = useState('');

  useEffect(() => {
    fetch('/api/student/profile')
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setProfile(j.data);
        setFirstName(j.data.firstName);
        setLastName(j.data.lastName);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    setSaving(true); setSaveMsg('');
    const res = await fetch('/api/student/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName }),
    });
    setSaving(false);
    if (res.ok) {
      setSaveMsg('Profile updated!');
      setProfile((p) => p ? { ...p, firstName, lastName } : p);
      setTimeout(() => setSaveMsg(''), 3000);
    } else {
      setSaveMsg('Failed to save.');
    }
  };

  const changePassword = async () => {
    setPassError(''); setPassMsg('');
    if (!curPass || !newPass || !confPass) { setPassError('All password fields are required.'); return; }
    if (newPass.length < 8)               { setPassError('New password must be at least 8 characters.'); return; }
    if (newPass !== confPass)             { setPassError('Passwords do not match.'); return; }
    setPassSaving(true);
    const res  = await fetch('/api/student/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: curPass, newPassword: newPass }),
    });
    const json = await res.json();
    setPassSaving(false);
    if (res.ok) {
      setPassMsg('Password changed successfully!');
      setCurPass(''); setNewPass(''); setConfPass('');
      setTimeout(() => setPassMsg(''), 3000);
    } else {
      setPassError(json.error ?? 'Failed to change password.');
    }
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <StudentLayout>
      <div className="px-6 py-8 max-w-3xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account information and password</p>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        )}

        {!loading && profile && (
          <div className="space-y-6">

            {/* Avatar + account info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="flex h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white" style={{ height: 72, width: 72 }}>
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{profile.firstName} {profile.lastName}</h2>
                  <p className="text-sm text-slate-500">{profile.email}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {profile.role === 'STUDENT' ? 'Student' : profile.role}
                    </span>
                    <span className="text-xs text-slate-400">Member since {fmtDate(profile.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit name */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Email Address</label>
                  <input
                    value={profile.email}
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 outline-none"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={saveProfile}
                  disabled={saving || !firstName.trim() || !lastName.trim()}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                {saveMsg && (
                  <span className={`text-sm font-medium ${saveMsg.includes('updated') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {saveMsg}
                  </span>
                )}
              </div>
            </div>

            {/* Change password */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Change Password</h3>
              <div className="space-y-3 max-w-sm">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Current Password</label>
                  <input
                    type="password"
                    value={curPass}
                    onChange={(e) => setCurPass(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">New Password</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Confirm New Password</label>
                  <input
                    type="password"
                    value={confPass}
                    onChange={(e) => setConfPass(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 ${
                      confPass && confPass !== newPass
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'
                    }`}
                  />
                  {confPass && confPass !== newPass && (
                    <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
                  )}
                </div>
              </div>
              {passError && (
                <p className="mt-3 text-sm text-red-600">{passError}</p>
              )}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={changePassword}
                  disabled={passSaving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {passSaving ? 'Updating…' : 'Update Password'}
                </button>
                {passMsg && <span className="text-sm font-medium text-emerald-600">{passMsg}</span>}
              </div>
            </div>

            {/* Application history */}
            {profile.applications.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Application History</h3>
                <div className="space-y-3">
                  {profile.applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{app.courseApplied ?? 'Unspecified course'}</p>
                        <p className="text-xs text-slate-400">Applied {fmtDate(app.createdAt)}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[app.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </StudentLayout>
  );
}
