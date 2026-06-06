'use client';
import { useState } from 'react';
import { Button } from '@shared/ui/Button';

const navigation = [
  {
    label: 'Fellowships',
    megaMenu: true,
    categories: [
      {
        title: 'Core Product Skills',
        items: [
          {
            name: 'Power BI Data Analyst Fellowship',
            href: '/fellowships/power-bi-data-analyst-fellowship',
            meta: 'Most Popular',
            desc: 'Learn Power BI dashboards, data modeling, and real-world analytics workflows.',
          },
          {
            name: 'Cohort Washington',
            href: '/fellowships/cohort-washington',
            meta: 'Starts July 4th',
            desc: 'Learn Power BI dashboards, data modeling, and real-world analytics workflows.',
          },
          {
            name: 'Cohort Lincoln',
            href: '/fellowships/cohort-lincoln',
            meta: 'Starts Sep 5th',
            desc: 'Hands-on training in business intelligence, reporting, and KPI tracking using Power BI.',
          },
        ],
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
          { name: 'Join as Instructor', href: '#' },
          { name: 'Volunteer with us',  href: '#' },
          { name: 'Contact Us',         href: '/contact' },
        ],
      },
    ],
  },
  {
    label: 'Donate',
    href: '/donate',
  },
  {
    label: 'Apply',
    href: '/contact',
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
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="/" className="text-xl font-bold text-slate-900">
          RiseWithData
        </a>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden items-center gap-8 lg:flex">
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
                  <div className="absolute left-1/2 top-full z-50 w-[750px] -translate-x-1/2 pt-4">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-6">

                      {/* TITLE */}
                      <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Power BI Data Analyst Fellowship
                      </h3>

                      {/* COHORT LIST */}
                      <div className="space-y-3">
                        {item.categories?.[0]?.items?.map((cohort: any) => (
                          <a
                            key={cohort.name}
                            href={cohort.href}
                            className="flex items-start justify-between rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50 group"
                          >
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                                {cohort.name}
                              </h4>
                              <p className="mt-1 text-xs text-slate-500">
                                {cohort.desc}
                              </p>
                            </div>
                            {cohort.meta && (
                              <span className="ml-4 flex-shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                {cohort.meta}
                              </span>
                            )}
                          </a>
                        ))}
                      </div>

                    </div>
                  </div>
                )}

                {/* ================= CAREERS ================= */}
                {item.label === 'Careers' && isOpen && (
                  <div className="absolute left-1/2 top-full z-50 w-[420px] -translate-x-1/2 pt-4">
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

        {/* RIGHT ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex">
          <a href="/login" className="text-sm text-slate-700 hover:text-slate-900">
            Login
          </a>
          <Button as="a" href="#final-cta" variant="primary">
            Get Started
          </Button>
        </div>

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