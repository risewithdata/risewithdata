export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)]" />

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pt-24">

        {/* Eyebrow */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            Now enrolling · Cohort Washington starts July 4
          </span>
        </div>

        {/* Headline */}
        <div className="mx-auto mt-8 max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Become a Job-Ready{' '}
            <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
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
            href="/apply"
            className="rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700"
          >
            Apply Now
          </a>
          <a
            href="/fellowships/power-bi-data-analyst-fellowship"
            className="rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View Fellowship Details →
          </a>
        </div>

        {/* Stats bar */}
     {/*    <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
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
        </div> */}

        {/* Featured program card */}
        

      </div>
    </section>
  );
}
