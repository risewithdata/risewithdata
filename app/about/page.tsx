'use client';

import { NavigationBar } from '@features/home/components/NavigationBar.client';


export default function AboutPage() {
  return (
    <>
      <NavigationBar />

      <main className="bg-white">

        {/* ================= HERO WITH GRADIENT ================= */}
        <section className="relative overflow-hidden">

          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />

          {/* Glow effects */}
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />

          {/* Content */}
          <div className="relative mx-auto max-w-6xl px-6 py-28 text-center text-white">

            <h1 className="text-5xl font-semibold tracking-tight">
              Why RiseWithData
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-200">
              We help professionals become job-ready in Data & AI through structured,
              cohort-based learning programs designed for real-world impact.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <a
                href="/apply"
                className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-slate-900 hover:bg-slate-200"
              >
                Apply Now
              </a>

              <a
                href="/fellowships"
                className="rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
              >
                Explore Programs
              </a>
            </div>

          </div>
        </section>

        {/* ================= VALUE PROPOSITIONS ================= */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Hands-on Learning</h3>
              <p className="mt-2 text-sm text-slate-600">
                Work on real-world datasets, dashboards, and analytics problems.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Mentor-led Cohorts</h3>
              <p className="mt-2 text-sm text-slate-600">
                Learn directly from industry experts in Data & AI roles.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Career Outcomes</h3>
              <p className="mt-2 text-sm text-slate-600">
                Build job-ready skills that translate into real opportunities.
              </p>
            </div>

          </div>
        </section>

        {/* ================= MISSION SECTION ================= */}
        <section className="mx-auto max-w-4xl px-6 py-24">

          <h2 className="text-3xl font-semibold text-slate-900">
            Our Mission
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            RiseWithData was created to bridge the gap between traditional education
            and industry expectations. Most learners struggle to apply theory to real
            job scenarios — we solve this through structured, hands-on learning paths.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Our mission is simple: help you become job-ready faster with real skills,
            real projects, and real outcomes.
          </p>

        </section>

        {/* ================= IMPACT STATS ================= */}
        <section className="bg-slate-900 py-20 text-white">

          <div className="mx-auto grid max-w-6xl gap-10 px-6 text-center md:grid-cols-3">

            <div>
              <h3 className="text-4xl font-semibold">10K+</h3>
              <p className="mt-2 text-sm text-slate-300">Learners trained</p>
            </div>

            <div>
              <h3 className="text-4xl font-semibold">100+</h3>
              <p className="mt-2 text-sm text-slate-300">Industry mentors</p>
            </div>

            <div>
              <h3 className="text-4xl font-semibold">85%</h3>
              <p className="mt-2 text-sm text-slate-300">Career success rate</p>
            </div>

          </div>

        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">

          <h2 className="text-3xl font-semibold text-slate-900">
            Ready to start your journey?
          </h2>

          <p className="mt-4 text-slate-600">
            Join a structured fellowship and build skills that matter.
          </p>

          <a
            href="/apply"
            className="mt-8 inline-block rounded-xl bg-slate-900 px-8 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Get Started
          </a>

        </section>

      </main>
    </>
  );
}