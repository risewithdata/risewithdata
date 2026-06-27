'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

const NAV = [
  {
    href:  '/dashboard/student/courses',
    label: 'My Courses',
    icon:  (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href:  '/dashboard/student/profile',
    label: 'Profile',
    icon:  (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    href:  '/dashboard/student/notifications',
    label: 'Notifications',
    icon:  (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

export function StudentLayout({ children }: Props) {
  const pathname  = usePathname();
  const [open,    setOpen]    = useState(false);
  const [user,    setUser]    = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((j) => { if (j.user) setUser(j.user); })
      .catch(() => {});

    fetch('/api/student/notifications')
      .then((r) => r.json())
      .then((j) => { if (j.data) setNotifCount(j.data.length); })
      .catch(() => {});
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '…';

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="flex h-16 flex-shrink-0 items-center border-b border-slate-100 px-5">
          <a href="/" className="flex-shrink-0">
            <img src="/logo.svg" alt="RiseWithData" className="h-9 w-auto" />
          </a>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Menu</p>
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>
                  {item.icon}
                </span>
                {item.label}
                {item.label === 'Notifications' && notifCount > 0 && (
                  <span className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-xs font-bold ${active ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-700'}`}>
                    {notifCount}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-slate-100 p-4 space-y-2">
          {user && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Mobile top bar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <a href="/">
            <img src="/logo.svg" alt="RiseWithData" className="h-8 w-auto" />
          </a>
          <a href="/dashboard/student/notifications" className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {notifCount}
              </span>
            )}
          </a>
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
