import { featuredPrograms } from '../homepage.data';

export function FeaturedPrograms() {
  return (
    <section id="programs" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Our Fellowships
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Live, cohort-based programs built for results
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Choose your cohort and start building real Power BI skills with a group of
            analysts who hold each other accountable.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {featuredPrograms.map((program) => (
            <article
              key={program.slug}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Top color band */}
              <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-violet-600" />

              <div className="flex flex-1 flex-col p-8">
                {/* Badge */}
                <span className="inline-block self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {program.badge}
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900">{program.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{program.desc}</p>

                {/* Meta */}
                <div className="mt-6 space-y-2 border-t border-slate-100 pt-6 text-sm">
                  {[
                    { label: 'Format',    value: program.format },
                    { label: 'Duration',  value: program.duration },
                    { label: 'Starts',    value: program.startDate },
                    { label: 'Level',     value: program.level },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-slate-400">{m.label}</span>
                      <span className="font-medium text-slate-700">{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Rating + enrollments */}
                <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
                  <span className="font-semibold text-amber-500">★ {program.rating}</span>
                  <span>{program.enrollments}</span>
                </div>

                {/* Price + CTA */}
                <div className="mt-auto pt-8">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-slate-900">{program.price}</p>
                    <a
                      href={`/fellowships/${program.slug}`}
                      className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="/contact"
            className="inline-block rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Not sure which cohort? Talk to an advisor →
          </a>
        </div>
      </div>
    </section>
  );
}
