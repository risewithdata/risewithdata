'use client';
import { faqs } from '../homepage.data';
import { Accordion } from '@shared/ui/Accordion';

export function FAQSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">

        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            FAQs
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Everything you need to know
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Clear answers to the most common questions before enrolling.
          </p>
        </div>

        <div className="mt-14">
          <Accordion items={faqs} />
        </div>

        {/* Still have questions */}
        <div className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="font-semibold text-slate-900">Still have questions?</p>
          <p className="mt-2 text-sm text-slate-500">
            Our team is happy to walk you through the program and help you pick the right cohort.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Talk to an Advisor
          </a>
        </div>

      </div>
    </section>
  );
}
