'use client';
import { useState } from 'react';

const navigation = [
  {
    label: 'Fellowships',
    megaMenu: true,
    main: {
      name: 'Power BI Data Analyst Fellowship',
      href: '/fellowships/power-bi-data-analyst-fellowship',
      meta: 'Most Popular',
      desc: 'Go from zero to job-ready Power BI analyst in 8 weeks.',
    },
    cohorts: [
      {
        name: 'Cohort Washington',
        href: '/fellowships/cohort-washington',
        meta: 'Starts July 4th',
      },
      /* {
        name: 'Cohort Lincoln',
        href: '/fellowships/cohort-lincoln',
        meta: 'Starts Sep 5th',
      }, */
    ],
  },
  { label: 'About Us',   href: '/about' },
  {
    label: 'Careers',
    megaMenu: true,
    sections: [
      {
        title: 'Get Involved',
        items: [
          { name: 'Join as Instructor', href: '/instructor' },
          { name: 'Volunteer with us',  href: '/volunteer' },
        ],
      },
    ],
  },
  { label: 'Contact Us', href: '/contact' },
  /* { label: 'Donate', href: '/donate' }, */
];

export function NavigationBar() {
  const [open, setOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const handleEnter = (label: string) => setActiveMegaMenu(label);
  const handleLeave = (label: string) => {
    setTimeout(() => setActiveMegaMenu((c) => (c === label ? null : c)), 150);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100 relative">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">

        {/* ── Logo ── */}
        <a href="/" className="flex-shrink-0">
          <img src="/logo.svg" alt="RiseWithData" className="h-14 w-auto" />
        </a>

        {/* ── Desktop Nav ── */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const isMega = item.megaMenu;
            const isOpen = activeMegaMenu === item.label;

            if (!isMega) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleEnter(item.label)}
                onMouseLeave={() => handleLeave(item.label)}
              >
                <button className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}>
                  {item.label}
                  <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* ── Fellowships dropdown ── */}
                {item.label === 'Fellowships' && isOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-3">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden ring-1 ring-black/5">

                      {/* Parent item */}
                      <a
                        href={(item as any).main.href}
                        className="group flex items-start justify-between gap-3 bg-gradient-to-br from-slate-900 to-blue-950 px-5 py-5 transition hover:from-slate-800 hover:to-blue-900"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-blue-400">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </span>
                            <p className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">
                              {(item as any).main.name}
                            </p>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed pl-6">
                            {(item as any).main.desc}
                          </p>
                        </div>
                        <span className="mt-0.5 flex-shrink-0 rounded-full bg-blue-500/25 border border-blue-400/30 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                          {(item as any).main.meta}
                        </span>
                      </a>

                      {/* Cohorts */}
                      <div className="px-4 py-3 space-y-0.5">
                        <p className="mb-2.5 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Active Cohorts
                        </p>
                        {(item as any).cohorts.map((cohort: any) => (
                          <a
                            key={cohort.name}
                            href={cohort.href}
                            className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-blue-50"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              </span>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                                {cohort.name}
                              </span>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                              {cohort.meta}
                            </span>
                          </a>
                        ))}
                      </div>

                    </div>
                  </div>
                )}

                {/* ── Careers dropdown ── */}
                {item.label === 'Careers' && isOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-[220px] -translate-x-1/2 pt-3">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden ring-1 ring-black/5">
                      <div className="p-2">
                        <p className="mb-1 px-3 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Get Involved
                        </p>
                        {item.sections?.[0]?.items?.map((i: { name: string; href: string }) => (
                          <a
                            key={i.name}
                            href={i.href}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100">
                              {i.name.includes('Instructor') ? '🎓' : '🤝'}
                            </span>
                            {i.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Right actions ── */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <a
            href="/login"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Login
          </a>
          <a
            href="/apply"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-blue-800"
          >
            Apply Now
          </a>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 lg:hidden space-y-1">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={(item as any).href || '#'}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
            <a href="/login" className="flex-1 rounded-xl border border-slate-200 py-2 text-center text-sm font-medium text-slate-700">Login</a>
            <a href="/apply" className="flex-1 rounded-xl bg-blue-600 py-2 text-center text-sm font-semibold text-white">Apply Now</a>
          </div>
        </div>
      )}
    </header>
  );
}
