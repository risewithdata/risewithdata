import { instructors } from '../homepage.data';

export function InstructorShowcase() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Your Instructors
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Learn from practitioners, not professors
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Every instructor has built real Power BI solutions at industry-leading companies
            and brings that experience directly to your cohort.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <article
              key={instructor.name}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Avatar */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-xl font-bold text-white">
                {instructor.name.split(' ').map((n) => n[0]).join('')}
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">{instructor.name}</h3>
              <p className="mt-1 text-sm font-medium text-brand-600">
                {instructor.title} · {instructor.company}
              </p>

              <div className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {instructor.experience} experience
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-500">{instructor.bio}</p>

              <div className="mt-6 flex gap-4 text-sm font-medium">
                <a href={instructor.social.linkedin} className="text-brand-600 hover:underline">
                  LinkedIn
                </a>
                <a href={instructor.social.twitter} className="text-slate-500 hover:text-slate-700">
                  Twitter
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
