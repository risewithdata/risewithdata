export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)]" />

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pt-24">

        {/* Eyebrow */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Now enrolling · Cohort Washington starts July 4
          </span>
        </div>

        {/* Headline */}
        <div className="mx-auto mt-8 max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Become a Job-Ready{' '}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Data Analyst
            </span>{' '}
            in 8 Weeks
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
            Live, cohort-based Power BI training with real industry datasets, weekly
            instructor feedback, and career coaching — designed to get you hired.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/contact"
            className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700"
          >
            Apply Now — Free
          </a>
          <a
            href="/fellowships/power-bi-data-analyst-fellowship"
            className="rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View Fellowship Details →
          </a>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: '3,400+', label: 'Fellows trained' },
            { value: '4.9 ★', label: 'Average rating' },
            { value: '91%',   label: 'Completion rate' },
            { value: '87%',   label: 'Hired within 6 mo.' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Featured program card */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
          <div className="grid lg:grid-cols-5">
            {/* Left info */}
            <div className="p-8 lg:col-span-3 lg:p-10">
              <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
                Featured Fellowship
              </span>
              <h2 className="mt-4 text-2xl font-bold text-white">
                Power BI Data Analyst Fellowship
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Go from zero to job-ready analyst. Master Power BI, DAX, data modeling,
                and visual storytelling through live instruction and real-world projects.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Live Online', '8 Weeks', 'Beginner – Intermediate'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href="/fellowships/power-bi-data-analyst-fellowship"
                className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Learn More
              </a>
            </div>

            {/* Right stats panel */}
            <div className="border-t border-white/10 p-8 lg:col-span-2 lg:border-l lg:border-t-0 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Live cohort dashboard
              </p>
              <div className="mt-6 space-y-4">
                {[
                  { label: 'Completion rate', value: '91%', bar: 91 },
                  { label: 'Avg. satisfaction', value: '4.9 / 5', bar: 98 },
                  { label: 'Job placement', value: '87%', bar: 87 },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{m.label}</span>
                      <span className="font-semibold text-white">{m.value}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                        style={{ width: `${m.bar}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Next cohort starts</p>
                <p className="mt-1 text-lg font-bold text-white">July 4, 2025</p>
                <p className="mt-0.5 text-xs text-slate-400">30 seats · 12 remaining</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
