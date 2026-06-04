import { instructors } from '../homepage.data';
import { Badge } from '@shared/ui/Badge';

export function InstructorShowcase() {
  return (
    <section className="py-20 lg:py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700">Instructor spotlight</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Learn from senior product leaders.</h2>
          </div>
          <p className="max-w-xl text-slate-600">Our instructors bring real-world experience from high-growth companies and enterprise product teams.</p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <article key={instructor.name} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 p-4 text-xl font-bold text-white shadow-lg">
                {instructor.name
                  .split(' ')
                  .map((part) => part.charAt(0))
                  .join('')}
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{instructor.name}</h3>
              <p className="mt-3 text-sm text-slate-600">{instructor.title}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge>{instructor.company}</Badge>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{instructor.experience} experience</span>
              </div>
              <div className="mt-6 flex gap-3 text-slate-500">
                <a href={instructor.social.twitter} className="text-slate-700 hover:text-slate-900">Twitter</a>
                <a href={instructor.social.linkedin} className="text-slate-700 hover:text-slate-900">LinkedIn</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
