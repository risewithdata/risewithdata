'use client';
import { testimonials } from '../homepage.data';

export function SuccessStories() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Success Stories
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              Real people, real outcomes
            </h2>
          </div>
          <p className="max-w-sm text-slate-500">
            87% of our graduates report a promotion or new role within 6 months.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div>
                <span className="text-3xl text-blue-200 leading-none">"</span>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.quote}</p>
              </div>

              <div className="mt-6">
                <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {t.outcome}
                </span>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating */}
        <div className="mt-14 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1 text-2xl text-amber-400">
            {'★★★★★'}
          </div>
          <p className="text-slate-500 text-sm">
            <span className="font-bold text-slate-900">4.9 / 5</span> average rating across 3,400+ fellows
          </p>
        </div>

      </div>
    </section>
  );
}
