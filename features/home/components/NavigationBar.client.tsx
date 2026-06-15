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
      {
        name: 'Cohort Lincoln',
        href: '/fellowships/cohort-lincoln',
        meta: 'Starts Sep 5th',
      },
    ],
  },
  {
    label: 'About Us',
    href: '/about',
  },
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
  {
    label: 'Contact Us',
    href: '/contact',
  },
  {
    label: 'Donate',
    href: '/donate',
  },
  {
    label: 'Apply',
    href: '/apply',
  },
];

export function NavigationBar() {
  const [open, setOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const handleEnter = (label: string) => setActiveMegaMenu(label);

  const handleLeave = (label: string) => {
    setTimeout(() => {
      setActiveMegaMenu((cur) => (cur === label ? null : cur));
    }, 120);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl relative">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="/" className="text-xl font-bold text-slate-900">
          RiseWithData
        </a>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {navigation.map((item) => {
            const isMega = item.megaMenu;
            const isOpen = activeMegaMenu === item.label;

            if (!isMega) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
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
                <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900">
                  {item.label}
                  <span className="text-xs text-slate-400">▾</span>
                </button>

                {/* ================= FELLOWSHIPS ================= */}
                {item.label === 'Fellowships' && isOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-4">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">

                      {/* PARENT — Power BI Fellowship */}
                      <a
                        href={(item as any).main.href}
                        className="group flex items-start justify-between gap-3 bg-slate-900 px-5 py-4 transition hover:bg-slate-800"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-blue-300">
                            {(item as any).main.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {(item as any).main.desc}
                          </p>
                        </div>
                        <span className="mt-0.5 flex-shrink-0 rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
                          {(item as any).main.meta}
                        </span>
                      </a>

                      {/* COHORTS — nested sub-items */}
                      <div className="px-4 py-3 space-y-1">
                        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                          Active Cohorts
                        </p>
                        {(item as any).cohorts.map((cohort: any) => (
                          <a
                            key={cohort.name}
                            href={cohort.href}
                            className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition hover:bg-blue-50"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                                {cohort.name}
                              </span>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                              {cohort.meta}
                            </span>
                          </a>
                        ))}
                      </div>

                    </div>
                  </div>
                )}

                {/* ================= CAREERS ================= */}
                {item.label === 'Careers' && isOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-[210px] -translate-x-1/2 pt-4">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-4">
                      
                      <div className="space-y-2">
                        {item.sections?.[0]?.items?.map((i: { name: string; href: string }) => (
                          <a
                            key={i.name}
                            href={i.href}
                            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
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


        {/* MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden rounded-full border p-2"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t bg-white px-6 py-5 lg:hidden">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href || '#'}
              className="block py-2 text-slate-700"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}