import { featuredPrograms } from '../homepage.data';
import { Badge } from '@shared/ui/Badge';

export function FeaturedPrograms() {
  return (
    <section id="programs" className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700">Featured programs</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Programs designed for ambitious product leaders.</h2>
          </div>
          <p className="max-w-xl text-slate-600">Choose curated programs with expert instructors, practical frameworks, and cohort-based learning.</p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredPrograms.map((program) => (
            <article key={program.title} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-slate-950">{program.title}</h3>
                <Badge>{program.duration}</Badge>
              </div>
              <p className="mt-4 text-sm text-slate-500">Instructor: <span className="font-medium text-slate-900">{program.instructor}</span></p>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">⭐ {program.rating}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{program.enrollments}</span>
              </div>
              <a href="#final-cta" className="mt-8 inline-flex rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-blue-500">
                Learn More
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
