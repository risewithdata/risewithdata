'use client';

import { NavigationBar } from '@features/home/components/NavigationBar.client';

const plans = [
  {
    name: 'Starter',
    description: 'A real taste of data analytics with live, project-based instruction.',
    price: 'Free',
    priceNote: 'refundable deposit*',
    popular: false,
    badge: null,
    badgeColor: null,
    cta: 'Apply Free',
    href: '/apply',
    ctaColor: 'bg-slate-900 hover:bg-slate-700 text-white',
    confirmation: { label: 'Results within 2 weeks', color: 'bg-blue-50 text-blue-700 border border-blue-200' },
    stats: [
      { value: '5',    label: 'weeks' },
      { value: '10',   label: 'sessions' },
      { value: '12.5', label: 'hours' },
    ],
    perks: [
      { text: '5 homework assignments', highlight: false },
      { text: '1 hands-on Power BI project', highlight: true },
      { text: 'Limited seats', highlight: false },
    ],
  },
  {
    name: 'Core',
    description: 'A fuller curriculum with more projects, more practice, and a certificate.',
    price: '$89',
    priceNote: 'one-time',
    popular: false,
    badge: null,
    badgeColor: null,
    cta: 'Enroll Now',
    href: '/checkout?plan=Core',
    ctaColor: 'bg-slate-900 hover:bg-slate-700 text-white',
    confirmation: { label: 'Instant confirmation', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    stats: [
      { value: '7',    label: 'weeks' },
      { value: '14',   label: 'sessions' },
      { value: '17.5', label: 'hours' },
    ],
    perks: [
      { text: '7 homework assignments', highlight: false },
      { text: '3 hands-on Power BI projects', highlight: true },
      { text: 'Resume review & feedback', highlight: false },
      { text: 'Certification of Training', highlight: false },
    ],
  },
  {
    name: 'Advanced',
    description: 'Our most complete track, with dedicated Power BI and Data Engineering projects.',
    price: '$139',
    priceNote: 'one-time',
    popular: true,
    badge: 'Most Popular',
    badgeColor: 'bg-amber-400 text-white',
    cta: 'Enroll Now',
    href: '/checkout?plan=Advanced',
    ctaColor: 'bg-amber-500 hover:bg-amber-600 text-white',
    confirmation: { label: 'Instant confirmation', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    stats: [
      { value: '10', label: 'weeks' },
      { value: '20', label: 'sessions' },
      { value: '25', label: 'hours' },
    ],
    perks: [
      { text: '10 homework assignments', highlight: false },
      { text: '3 Power BI + 3 Fabric Data Eng. projects', highlight: true },
      { text: 'Portfolio website guidance', highlight: false },
      { text: 'Resume review & certificate', highlight: false },
    ],
  },
  {
    name: 'Elite',
    description: 'Everything in Advanced, plus personalized 1:1 coaching to accelerate your growth.',
    price: '$179',
    priceNote: 'one-time',
    popular: false,
    badge: '+ 1:1 Coaching',
    badgeColor: 'bg-purple-600 text-white',
    cta: 'Enroll Now',
    href: '/checkout?plan=Elite',
    ctaColor: 'bg-purple-600 hover:bg-purple-700 text-white',
    confirmation: { label: 'Instant confirmation', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    stats: [
      { value: '10', label: 'weeks' },
      { value: '20', label: 'sessions' },
      { value: '4',  label: '1:1 calls' },
    ],
    perks: [
      { text: 'Everything in Advanced', highlight: false },
      { text: '4 private sessions (45 min each) on Power BI & Fabric', highlight: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <NavigationBar />
      <main className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="mx-auto max-w-screen-2xl px-6 py-10 lg:px-12">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Choose your learning path
            </h1>
            <p className="mt-2 text-base text-slate-500">
              Live instruction, real projects, real results.
            </p>

            {/* Info pills */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Starter: Short application, results within 2 weeks
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Core, Advanced, Elite: pay and get instant confirmation
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl bg-white transition hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular
                    ? 'border-2 border-amber-400 shadow-lg'
                    : 'border border-slate-200 shadow-sm'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5 pt-8">

                  {/* Plan name */}
                  <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>

                  {/* Price */}
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className={`font-extrabold text-slate-900 ${plan.price === 'Free' ? 'text-3xl' : 'text-4xl'}`}>
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400">{plan.priceNote}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{plan.description}</p>

                  {/* Confirmation pill */}
                  <div className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${plan.confirmation.color}`}>
                    <span className={`h-2 w-2 flex-shrink-0 rounded-full ${plan.name === 'Starter' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                    {plan.confirmation.label}
                  </div>

                  {/* Stats row */}
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {plan.stats.map((s) => (
                      <div key={s.label} className="rounded-lg border border-slate-100 bg-slate-50 py-2 text-center">
                        <p className="text-sm font-bold text-slate-900">{s.value}</p>
                        <p className="text-[10px] text-slate-500">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <hr className="my-3 border-slate-100" />

                  {/* Features */}
                  <ul className="flex-1 space-y-1.5">
                    {plan.perks.map((perk) => (
                      <li
                        key={perk.text}
                        className={`flex items-start gap-2 rounded-lg px-2 py-1 text-xs ${
                          perk.highlight ? 'bg-amber-50 font-semibold text-slate-800' : 'text-slate-600'
                        }`}
                      >
                        <svg
                          className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${perk.highlight ? 'text-amber-500' : 'text-amber-400'}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        {perk.text}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={plan.href}
                    className={`mt-5 block rounded-xl py-3 text-center text-sm font-bold transition ${plan.ctaColor}`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="mt-4 text-center text-xs text-slate-400">
            *Starter deposit is refundable — returned in full once you&apos;ve attended 60%+ of sessions, or if you withdraw before Week 2.
          </p>

          {/* Bottom CTA */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Not sure which plan is right for you?</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Book a free 15-minute call with our admissions team — we&apos;ll help you pick the best fit.
            </p>
            <a
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Talk to Admissions
            </a>
          </div>

        </div>
      </main>
    </>
  );
}
