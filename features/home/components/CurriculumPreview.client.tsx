'use client';
import { useState } from 'react';
import { curriculumModules } from '../homepage.data';

export function CurriculumPreview() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Curriculum Preview
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              What you'll learn in 8 weeks
            </h2>
          </div>
          <a
            href="/fellowships/power-bi-data-analyst-fellowship#curriculum"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            See full curriculum →
          </a>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          {/* Tab buttons */}
          <div className="flex flex-row gap-3 lg:col-span-2 lg:flex-col">
            {curriculumModules.map((mod, i) => (
              <button
                key={mod.title}
                type="button"
                onClick={() => setActive(i)}
                className={`flex-1 rounded-2xl border p-4 text-left transition lg:flex-initial ${
                  active === i
                    ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50'
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-wider ${active === i ? 'text-blue-200' : 'text-slate-400'}`}>
                  Module {i + 1}
                </p>
                <p className="mt-1 font-semibold">{mod.title}</p>
              </button>
            ))}
          </div>

          {/* Lesson list */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Module {active + 1}
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {curriculumModules[active].title}
              </h3>

              <ul className="mt-8 space-y-4">
                {curriculumModules[active].lessons.map((lesson, i) => (
                  <li
                    key={lesson}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{lesson}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Hands-on practice with real datasets and live instructor feedback.
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl bg-blue-600 p-6 text-white">
                <p className="font-semibold">Every module includes:</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-blue-100">
                  {['Live sessions', 'Recorded replay', 'Practice dataset', 'Project submission'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-blue-300">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
