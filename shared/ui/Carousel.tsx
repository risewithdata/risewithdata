 'use client';
import { useState } from 'react';

type Slide = {
  quote: string;
  name: string;
  role: string;
  outcome: string;
};

type Props = {
  slides: Slide[];
};

export function Carousel({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const current = slides[index];
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">Success story</p>
          <p className="mt-2 text-slate-600">Real outcomes from ambitious learners.</p>
        </div>
        <div className="flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setIndex(idx)}
              className={`h-2.5 w-10 rounded-full transition ${idx === index ? 'bg-blue-600' : 'bg-slate-300'}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-8 space-y-6">
        <blockquote className="text-xl leading-9 text-slate-900">“{current.quote}”</blockquote>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{current.name}</span>
          <span>{current.role}</span>
          <span className="text-slate-400">•</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{current.outcome}</span>
        </div>
      </div>
    </div>
  );
}
