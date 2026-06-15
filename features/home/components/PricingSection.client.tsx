'use client';
import { pricingPlans } from '../homepage.data';

export function PricingSection() {
  return (
    <section id="pricing" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Pricing
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            One-time payment. Lifetime access to materials. 7-day money-back guarantee.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col overflow-hidden rounded-3xl border shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                plan.popular
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 py-2 text-center text-xs font-bold uppercase tracking-widest text-white">
                  Most Popular
                </div>
              )}

              <div className="flex flex-1 flex-col p-8">
                <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mt-1 text-sm ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>
                  {plan.description}
                </p>

                <div className="mt-8">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.priceMonthly}
                  </span>
                  <span className={`ml-2 text-sm ${plan.popular ? 'text-blue-200' : 'text-slate-400'}`}>
                    one-time
                  </span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.perks.map((perk) => (
                    <li key={perk} className={`flex items-start gap-3 text-sm ${plan.popular ? 'text-blue-100' : 'text-slate-600'}`}>
                      <span className={`mt-0.5 flex-shrink-0 font-bold ${plan.popular ? 'text-white' : 'text-blue-600'}`}>
                        ✓
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>

                <a
                  href="/apply"
                  className={`mt-10 block rounded-xl py-3.5 text-center text-sm font-semibold transition ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-slate-900 text-white hover:bg-slate-700'
                  }`}
                >
                  {plan.popular ? 'Apply Now' : 'Get Started'}
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Guarantee note */}
        <p className="mt-10 text-center text-sm text-slate-400">
          All plans include a <span className="font-semibold text-slate-700">7-day full refund guarantee</span> · Secure checkout · No hidden fees
        </p>

      </div>
    </section>
  );
}
