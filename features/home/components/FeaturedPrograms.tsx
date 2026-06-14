import { featuredPrograms } from '../homepage.data';

export function FeaturedPrograms() {
  const [main, ...cohorts] = featuredPrograms;

  return (
    <section id="programs" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Our Fellowships
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Programs built for results
            </h2>
          </div>
          <a
            href="/contact"
            className="self-start rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 sm:self-auto"
          >
            Talk to an advisor →
          </a>
        </div>

        {/* Main program card — compact horizontal */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 px-7 py-6">

            {/* Left — title + badges */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white text-lg">
                📊
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                    Flagship
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-400">
                    {main.badge}
                  </span>
                </div>
                <h3 className="mt-1.5 text-base font-bold text-white">{main.title}</h3>
                <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-400">
                  <span>{main.format}</span>
                  <span>·</span>
                  <span>{main.duration}</span>
                  <span>·</span>
                  <span>{main.level}</span>
                </div>
              </div>
            </div>

            {/* Right — CTA */}
            <a
              href={`/fellowships/${main.slug}`}
              className="flex-shrink-0 self-start rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 sm:self-center"
            >
              View Fellowship →
            </a>
          </div>

          {/* Included tags row */}
          <div className="flex flex-wrap gap-2 border-t border-white/10 px-7 py-4">
            {[
              'Live instruction',
              'Recorded replays',
              'Capstone project',
              'Career coaching',
              'Certificate',
              'Alumni network',
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400"
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cohort sub-items */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {cohorts.map((cohort, i) => (
            <a
              key={cohort.slug}
              href={`/fellowships/${cohort.slug}`}
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              {/* Left connector line */}
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-violet-400 opacity-0 transition group-hover:opacity-100" />

              <div className="flex items-center gap-4">
                {/* Sub-indent indicator */}
                <div className="flex flex-col items-center gap-0.5 self-stretch py-1">
                  <div className="w-px flex-1 bg-slate-200" />
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-blue-500" />
                  <div className="w-px flex-1 bg-slate-200" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                      {cohort.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                    {cohort.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Starts {cohort.startDate} · {cohort.duration} · {cohort.format}
                  </p>
                </div>
              </div>

              <span className="ml-3 flex-shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500">
                →
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
