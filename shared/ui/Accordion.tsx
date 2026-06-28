 'use client';
import { useState } from 'react';

type Item = {
  question: string;
  answer: string;
};

type Props = {
  items: Item[];
};

export function Accordion({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <div key={item.question} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-semibold text-slate-900"
              onClick={() => setActiveIndex(isActive ? -1 : index)}
              aria-expanded={isActive}
            >
              {item.question}
              <span className={`ml-4 inline-flex h-9 w-9 items-center justify-center rounded-full border ${isActive ? 'border-brand-400 bg-brand-600 text-brand-600' : 'border-slate-300 text-slate-500'}`}>
                {isActive ? '−' : '+'}
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isActive ? 'max-h-96 px-6 pb-6' : 'max-h-0 px-6'}`}>
              <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
