'use client';
import { useState } from 'react';
import { Button } from '@shared/ui/Button';

const navItems = [
  { label: 'Products', href: '#programs' },
  { label: 'Courses', href: '#courses' },
  { label: 'Resources', href: '#community' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' }
];

export function NavigationBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#top" className="text-xl font-bold tracking-tight text-slate-900">
          RiseWithData
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm font-medium text-slate-700 hover:text-slate-900">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Login
          </a>
          <Button as="a" href="#final-cta" variant="primary">
            Get Started
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation"
        >
          <span className="text-xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>
      {open ? (
        <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
          <div className="space-y-4">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="block text-base font-medium text-slate-700 hover:text-slate-900">
                {item.label}
              </a>
            ))}
            <a href="/login" className="block text-base font-medium text-slate-700 hover:text-slate-900">
              Login
            </a>
            <Button as="a" href="#final-cta" variant="primary" className="w-full text-center">
              Get Started
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
