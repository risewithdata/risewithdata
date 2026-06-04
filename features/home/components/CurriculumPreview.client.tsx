'use client';
import { curriculumModules } from '../homepage.data';
import { Tabs } from '@shared/ui/Tabs';

export function CurriculumPreview() {
  const tabs = curriculumModules.map((module) => ({
    title: module.title,
    content: (
      <div className="space-y-4">
        {module.lessons.map((lesson) => (
          <div key={lesson} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-base font-semibold text-slate-900">{lesson}</p>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">✓</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">Learn practical skills through hands-on lessons and templates.</p>
          </div>
        ))}
      </div>
    )
  }));

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700">Curriculum preview</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Explore course modules and lessons.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">Interactive modules with clear progress indicators and expandable learning paths.</p>
        </div>
        <div className="mt-12">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </section>
  );
}
