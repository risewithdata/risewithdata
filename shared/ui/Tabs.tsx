 'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';

type Tab = {
  title: string;
  content: React.ReactNode;
};

type Props = {
  tabs: Tab[];
};

export function Tabs({ tabs }: Props) {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-2 sm:flex-row">
        {tabs.map((tab, index) => (
          <button
            key={tab.title}
            type="button"
            onClick={() => setActive(index)}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${active === index ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {tabs[active].content}
      </div>
    </div>
  );
}
