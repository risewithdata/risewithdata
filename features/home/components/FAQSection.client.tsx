'use client';
import { faqs } from '../homepage.data';
import { Accordion } from '@shared/ui/Accordion';

export function FAQSection() {
  return (
    <section className="py-20 lg:py-24" id="about">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700">Frequently asked questions</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Everything you need to know before enrolling.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">Clear answers to the most common questions from prospective learners.</p>
        </div>
        <div className="mt-12">
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
