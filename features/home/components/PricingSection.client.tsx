'use client';
import { useState } from 'react';
import { pricingPlans } from '../homepage.data';
import { Badge } from '@shared/ui/Badge';

export function PricingSection() {
  const [yearly, setYearly] = useState(true);
  return (
    <section id="pricing" className="py-20 lg:py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Flexible plans for individuals and teams.</h2>
          </div>
          <div className="inline-flex items-center gap-4 rounded-full bg-white p-2 shadow-sm">
            <span className={`text-sm font-semibold ${yearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button
              type="button"
              onClick={() => setYearly(!yearly)}
              className="relative inline-flex h-9 w-16 items-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 p-1"
            >
              <span className={`absolute left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-white transition ${yearly ? 'translate-x-0' : 'translate-x-7'}`} />
            </button>
            <span className={`text-sm font-semibold ${!yearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</span>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-[2rem] border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${plan.popular ? 'border-blue-400 bg-white' : 'border-slate-200 bg-white'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950">{plan.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
                </div>
                {plan.popular ? <Badge>Popular</Badge> : null}
              </div>
              <div className="mt-8 flex items-end gap-3">
                <p className="text-5xl font-semibold text-slate-950">{yearly ? plan.priceYearly : plan.priceMonthly}</p>
                <span className="pb-1 text-sm text-slate-500">/ {yearly ? 'year' : 'month'}</span>
              </div>
              <ul className="mt-8 space-y-4 text-sm text-slate-600">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    {perk}
                  </li>
                ))}
              </ul>
              <a href="#final-cta" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-blue-500">
                Choose Plan
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
