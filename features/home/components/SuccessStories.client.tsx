'use client';
import { testimonials } from '../homepage.data';
import { Carousel } from '@shared/ui/Carousel';

export function SuccessStories() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700">Success stories</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Learners who transformed their careers.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">Testimonials from professionals who gained confidence, promotions, and new opportunities.</p>
        </div>
        <div className="mt-12">
          <Carousel slides={testimonials} />
        </div>
      </div>
    </section>
  );
}
