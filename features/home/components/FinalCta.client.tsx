'use client';

export function FinalCta() {
  return (
    <section id="final-cta" className="bg-white py-8 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-20 shadow-2xl lg:px-16">

          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
          </div>

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Limited seats per cohort
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Start your data analyst career this summer
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                Join Cohort Washington on July 4 and graduate with 5 real Power BI
                dashboards, a verified certificate, and a career coaching session — in 8 weeks.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { v: '30', l: 'Seats total' },
                  { v: '8 wks', l: 'Duration' },
                  { v: '7-day', l: 'Money back' },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xl font-bold text-white">{s.v}</p>
                    <p className="mt-1 text-xs text-slate-400">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — CTA card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <p className="text-lg font-bold text-white">Reserve your seat today</p>
              <p className="mt-2 text-sm text-slate-400">
                Applications are reviewed within 48 hours. No payment required to apply.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href="/contact"
                  className="block w-full rounded-xl bg-blue-600 py-4 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500"
                >
                  Apply Now — It's Free
                </a>
                <a
                  href="/fellowships/power-bi-data-analyst-fellowship"
                  className="block w-full rounded-xl border border-white/20 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View Full Fellowship Details
                </a>
              </div>

              <div className="mt-6 space-y-2 text-sm text-slate-400">
                {[
                  '✓ No prior experience required',
                  '✓ Sessions are recorded — never miss a class',
                  '✓ 7-day full refund guarantee',
                ].map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
