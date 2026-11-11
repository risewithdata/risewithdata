'use client';

import { notFound } from 'next/navigation';
import { use, useState } from 'react';
import { NavigationBar } from '@features/home/components/NavigationBar.client';
import { getFellowshipBySlug } from '@features/fellowships/fellowship.data';

type Props = { params: Promise<{ slug: string }> };

export default function FellowshipPage({ params }: Props) {
  const { slug } = use(params);
  const fellowship = getFellowshipBySlug(slug);
  if (!fellowship) notFound();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openModule, setOpenModule] = useState<number | null>(0);

  return (
    <>
      <NavigationBar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="absolute -top-48 left-1/4 h-[600px] w-[600px] rounded-full bg-brand-600/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
            <a href="/" className="hover:text-white">Home</a>
            <span>/</span>
            <a href="/fellowships" className="hover:text-white">Fellowships</a>
            <span>/</span>
            <span className="text-slate-200">{fellowship.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left — title & info */}
            <div className="lg:col-span-2">
              <span className="inline-block rounded-full bg-brand-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-600">
                {fellowship.badge}
              </span>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {fellowship.name}
              </h1>

              <p className="mt-5 text-xl text-slate-300">{fellowship.tagline}</p>

              <p className="mt-4 text-base leading-relaxed text-slate-400">{fellowship.description}</p>

              {/* Meta pills */}
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { icon: '📡', label: fellowship.format },
                  { icon: '⏱', label: fellowship.duration },
                  { icon: '📅', label: fellowship.startDate },
                  { icon: '🕙', label: fellowship.level },
                ].map((pill) => (
                  <span
                    key={pill.label}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                  >
                    <span>{pill.icon}</span> {pill.label}
                  </span>
                ))}
              </div>

              {/* Social proof */}
              {/* <div className="mt-10 flex flex-wrap items-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{fellowship.totalLearners}</p>
                  <p className="text-xs text-slate-400">Learners enrolled</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">⭐ {fellowship.rating}</p>
                  <p className="text-xs text-slate-400">Average rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{fellowship.completionRate}</p>
                  <p className="text-xs text-slate-400">Completion rate</p>
                </div>
              </div> */}
            </div>

            {/* Right — enrollment card (desktop) */}
            <div className="hidden lg:block">
              <EnrollCard fellowship={fellowship} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== HIRING PARTNERS BAR ===== */}
      <section className="border-b border-slate-100 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Technologies covered are used by most Fortune 500 companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {fellowship.hiringPartners.map((co) => (
              <span key={co} className="text-sm font-semibold text-slate-400">
                {co}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT + STICKY SIDEBAR ===== */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-3">
          {/* LEFT COLUMN */}
          <main className="space-y-20 lg:col-span-2">

            {/* What you'll learn */}
            <section id="outcomes">
              <SectionLabel>What You&apos;ll Learn</SectionLabel>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Skills employers look for
              </h2>
              <p className="mt-3 text-slate-500">
                Every outcome is drawn from real job descriptions across top analytics teams.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {fellowship.outcomes.map((o) => (
                  <div key={o} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
                      ✓
                    </span>
                    <p className="text-sm text-slate-700">{o}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Who is this for */}
            <section id="who">
              <SectionLabel>Who This Is For</SectionLabel>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Built for career movers</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {fellowship.whoIsThisFor.map((w) => (
                  <div key={w.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="font-semibold text-slate-900">{w.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{w.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section id="curriculum">
              <SectionLabel>Curriculum</SectionLabel>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {fellowship.curriculum.length}-week program, week by week
              </h2>
              <p className="mt-3 text-slate-500">
                🕙 10:00 – 11:15 AM ET, Sat & Sun
              </p>
              <div className="mt-8 space-y-3">
                {fellowship.curriculum.map((mod, i) => {
                  const isOpen = openModule === i;
                  return (
                    <div
                      key={mod.week}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-6 py-5 text-left"
                        onClick={() => setOpenModule(isOpen ? null : i)}
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                              {mod.week}
                            </p>
                            <p className="mt-0.5 font-semibold text-slate-900">{mod.title}</p>
                          </div>
                        </div>
                        <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm transition ${isOpen ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 text-slate-400'}`}>
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                          <ul className="space-y-2">
                            {mod.topics.map((t) => (
                              <li key={t} className="flex items-start gap-2 text-sm text-slate-600">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Instructors */}
            <section id="instructors">
              <SectionLabel>Your Instructors</SectionLabel>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Learn from practitioners, not professors
              </h2>
              <div className="mt-8 space-y-6">
                {fellowship.instructors.map((ins) => (
                  <div
                    key={ins.name}
                    className="flex gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-xl font-bold text-white">
                      {ins.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-slate-900">
                          {ins.name}
                          {ins.role && (
                            <span className="ml-2 font-semibold text-brand-600"> — {ins.role}</span>
                          )}
                        </p>
                        {ins.linkedin && (
                          <a href={ins.linkedin} target="_blank" rel="noreferrer" aria-label={`${ins.name} on LinkedIn`} className="flex-shrink-0 text-[#0A66C2] hover:opacity-75 transition-opacity">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-brand-600">{ins.title}, {ins.company}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-500">{ins.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            {/* <section id="testimonials">
              <SectionLabel>Success Stories</SectionLabel>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Real outcomes from real graduates
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {fellowship.testimonials.map((t) => (
                  <div
                    key={t.name}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div>
                      <span className="text-2xl text-brand-600">"</span>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.quote}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 text-sm font-bold text-white">
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-400">{t.role} · {t.company}</p>
                      </div>
                    </div>
                    <span className="mt-3 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {t.outcome}
                    </span>
                  </div>
                ))}
              </div>
            </section> */}

            {/* FAQ */}
            <section id="faq">
              <SectionLabel>FAQs</SectionLabel>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Common questions
              </h2>
              <div className="mt-8 space-y-3">
                {fellowship.faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={faq.question}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-6 py-5 text-left font-semibold text-slate-900"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        aria-expanded={isOpen}
                      >
                        {faq.question}
                        <span className={`ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm transition ${isOpen ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 text-slate-400'}`}>
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                          <p className="text-sm leading-7 text-slate-500">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </main>

          {/* RIGHT COLUMN — sticky enrollment card */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <EnrollCard fellowship={fellowship} />
            </div>
          </aside>
        </div>
      </div>

      {/* ===== MOBILE ENROLL STICKY FOOTER ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-6 py-4 shadow-2xl lg:hidden">
        <div className="flex items-center justify-between gap-4">
          {fellowship.showPrice !== false && (
            <div>
              <p className="text-lg font-bold text-slate-900">{fellowship.price}</p>
              <p className="text-xs text-slate-400 line-through">{fellowship.originalPrice}</p>
            </div>
          )}
          <a
            href="/pricing"
            className="flex-1 rounded-xl bg-brand-600 py-3 text-center text-sm font-semibold text-white hover:bg-brand-600"
          >
            Enroll Now
          </a>
        </div>
      </div>
      <div className="h-24 lg:hidden" />
    </>
  );
}

/* ── Enroll Card ────────────────────────────────────────────────── */
function EnrollCard({ fellowship }: { fellowship: ReturnType<typeof getFellowshipBySlug> & {} }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      {/* Price — hidden for cohorts with showPrice: false */}
      {fellowship!.showPrice !== false && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-6 text-white">
          <div className="flex items-end gap-3">
            <p className="text-4xl font-bold">{fellowship!.price}</p>
            <p className="mb-1 text-sm text-slate-400 line-through">{fellowship!.originalPrice}</p>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Deadline: {fellowship!.enrollmentDeadline}
          </p>
        </div>
      )}

      <div className="p-6">
        <a
          href="/pricing"
          className="block w-full rounded-xl bg-brand-600 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Enroll Now
        </a>
        <a
          href="/contact"
          className="mt-3 block w-full rounded-xl border border-slate-200 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Talk to an Advisor
        </a>

        {/* Includes */}
        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            This fellowship includes
          </p>
          {[
            '10 weeks of live instruction',
            '20 live sessions',
            'Real-world capstone project',
            'Instructor & peer feedback',
            'Fellowship certificate',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="text-brand-600">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section label ──────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">{children}</p>
  );
}
