'use client';

import { NavigationBar } from '@features/home/components/NavigationBar.client';

const plans = [
  {
    name: 'Starter',
    icon: '🌱',
    iconBg: 'bg-slate-100',
    description: 'Get a real taste of data analytics with live, project-based instruction.',
    price: 'Free',
    priceNote: 'refundable deposit*',
    popular: false,
    cta: 'Apply Free',
    href: '/apply',
    badge: null,
    perks: [
      { text: '5 weeks of live, instructor-led training', highlight: false },
      { text: '10 live sessions (60 min class + 15 min practice) — 12.5 hours total', highlight: false },
      { text: '1 hands-on Power BI project', highlight: true },
      { text: 'Slide decks + 5 homework assignments', highlight: false },
      { text: 'Fixed number of seats allocated to this plan', highlight: false },
    ],
    additions: null,
    footnote: '*Selected applicants place a fully refundable $50 deposit — returned in full once you\'ve attended 60%+ of sessions, or if you withdraw before Week 2. It just makes sure every seat goes to someone who\'ll show up.',
  },
  {
    name: 'Core',
    icon: '📘',
    iconBg: 'bg-blue-50',
    description: 'A fuller curriculum with more projects, more practice, and Certificate.',
    price: '$89',
    priceNote: 'one-time',
    popular: false,
    cta: 'Enroll Now',
    href: '/checkout?plan=Core',
    badge: null,
    perks: [
      { text: '7 weeks of live, instructor-led training', highlight: false },
      { text: '14 live sessions (60 min class + 15 min practice) — 17.5 hours total', highlight: false },
      { text: '3 hands-on Power BI projects', highlight: true },
      { text: 'Slide decks + 7 homework assignments', highlight: false },
      { text: 'Resume review & feedback', highlight: true },
      { text: 'Certification of Training', highlight: true },
    ],
    additions: [
      '+2 extra weeks & 4 more sessions',
      '+2 additional Power BI projects',
      'Resume review & feedback',
      'Certification of Training',
    ],
    footnote: null,
  },
  {
    name: 'Advanced',
    icon: '🚀',
    iconBg: 'bg-amber-50',
    description: 'Our most complete track, with dedicated Power BI and Data Engineering projects.',
    price: '$139',
    priceNote: 'one-time',
    popular: true,
    cta: 'Enroll Now',
    href: '/checkout?plan=Advanced',
    badge: null,
    perks: [
      { text: '10 weeks of live, instructor-led training', highlight: false },
      { text: '20 live sessions (60 min class + 15 min practice) — 25 hours total', highlight: false },
      { text: '3 Power BI projects + 3 Microsoft Fabric Data Engineering projects', highlight: true },
      { text: 'Resume review & feedback', highlight: false },
      { text: 'Slide decks + 10 homework assignments', highlight: false },
      { text: 'Certification of Training', highlight: false },
      { text: 'Portfolio website building guidance', highlight: true },
    ],
    additions: [
      '+3 extra weeks & 6 more sessions',
      '3 Microsoft Fabric Data Engineering projects',
      'Portfolio website building guidance',
    ],
    footnote: null,
  },
  {
    name: 'Elite',
    icon: '👑',
    iconBg: 'bg-purple-50',
    description: 'Everything in Advanced, plus personalized 1:1 coaching to accelerate your growth.',
    price: '$250',
    priceNote: 'one-time',
    popular: false,
    badge: 'Best Value + 1:1 Coaching',
    cta: 'Enroll Now',
    href: '/checkout?plan=Elite',
    perks: [
      { text: 'Everything included in Advanced', highlight: false },
      { text: 'Certification of Training', highlight: false },
      { text: '6 sessions of 1:1 training (45 mins each) on Power BI & Microsoft Fabric Data Engineering', highlight: true },
    ],
    additions: [
      '6 × 45-min personal 1:1 coaching sessions',
      'Direct feedback on your Power BI & Data Engineering work',
    ],
    footnote: null,
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
                {/* Most Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="whitespace-nowrap rounded-full bg-amber-400 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Custom badge (e.g. Elite) */}
                {(plan as any).badge && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="whitespace-nowrap rounded-full bg-purple-600 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow">
                      {(plan as any).badge}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5 pt-8">

                  {/* Icon */}
                  <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-lg ${plan.iconBg}`}>
                    {plan.icon}
                  </div>

                  {/* Plan name */}
                  <h2 className="text-base font-bold text-slate-900">{plan.name}</h2>

                  {/* Price */}
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className={`font-extrabold text-slate-900 ${plan.price === 'Free' ? 'text-2xl' : 'text-3xl'}`}>
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400">{plan.priceNote}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{plan.description}</p>

                  {/* CTA */}
                  <a
                    href={plan.href}
                    className="mt-4 block rounded-xl bg-slate-900 py-2.5 text-center text-sm font-bold text-white transition hover:bg-slate-700"
                  >
                    {plan.cta}
                  </a>

                  {/* Divider */}
                  <hr className="my-3 border-slate-100" />

                  {/* Features — regular first, highlighted at bottom, no gap */}
                  <ul className="flex-1 space-y-1">
                    {[...plan.perks.filter(p => !p.highlight), ...plan.perks.filter(p => p.highlight)].map((perk) => (
                      <li key={perk.text} className={`flex items-start gap-2 rounded-lg px-2 py-0.5 text-xs ${
                        perk.highlight ? 'bg-amber-50 font-semibold text-slate-800' : 'text-slate-600'
                      }`}>
                        <svg className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${perk.highlight ? 'text-amber-500' : 'text-amber-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        {perk.text}
                      </li>
                    ))}
                  </ul>

                  {/* Additions vs previous plan */}
                  {plan.additions && (
                    <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50 p-3">
                      <p className="mb-1.5 text-xs font-bold tracking-wider text-brand-600">
                        vs {plan.name === 'Core' ? 'Starter' : plan.name === 'Advanced' ? 'Core' : 'Advanced'}
                      </p>
                      <ul className="space-y-1">
                        {plan.additions.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs font-medium text-brand-700">
                            <span className="mt-0.5 text-brand-500">+</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Footnote */}
                  {plan.footnote && (
                    <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-400">
                      *Selected applicants place a fully refundable{' '}
                      <strong className="font-semibold text-slate-600">$50 deposit</strong>
                      {' '}— returned in full once you&apos;ve attended 60%+ of sessions, or if you withdraw before Week 2. It just makes sure every seat goes to someone who&apos;ll show up.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Not sure which plan is right for you?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Book a free 15-minute call with our admissions team — we&apos;ll help you pick the best fit.
            </p>
            <a
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Talk to Admissions
            </a>
          </div>

        </div>
      </main>
    </>
  );
}
