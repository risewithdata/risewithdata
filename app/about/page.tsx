'use client';

import { NavigationBar } from '@features/home/components/NavigationBar.client';
import { Footer } from '@features/home/components/Footer';


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
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />

        </section>

        {/* ================= MISSION SECTION ================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-warm-100 py-16">

          {/* Background glows */}
          <div className="pointer-events-none absolute -top-20 right-0 h-[420px] w-[420px] rounded-full bg-brand-100/50 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-sky-100/50 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6">

            {/* Two-column layout */}
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

              {/* Left — headline + paragraphs */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10 bg-brand-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Our Mission</span>
                </div>

                <h2 className="text-4xl font-bold leading-tight text-slate-900">
                  Empowering talent with skills that{' '}
                  <span className="text-brand-600">open doors</span>
                </h2>

                <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-600">
                  <p>
                    Rise with Data is an education-focused platform dedicated to helping motivated
                    individuals develop the skills needed to succeed in today's evolving job market.
                    We provide <span className="font-semibold text-slate-800">live, online training</span> designed
                    to bridge the gap between traditional education and the practical skills employers seek.
                  </p>
                  <p>
                    We believe talent is everywhere, but access to quality training and mentorship is not.
                    Through expert-led instruction, hands-on learning, and a supportive community, we help
                    participants gain confidence, build real-world skills, and prepare for meaningful career opportunities.
                  </p>
                  <p>
                    At Rise with Data, we value motivation, commitment, and a willingness to learn. Our
                    mission is to empower individuals with the knowledge, mindset, and skills needed to
                    achieve better careers, greater financial stability, and an improved quality of life.
                  </p>
                </div>
              </div>

              {/* Right — value pillars */}
              <div className="space-y-4">

                {/* Quote callout */}
                <div className="relative rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white shadow-xl shadow-brand-500/25">
                  <svg className="mb-4 h-8 w-8 text-brand-300/60" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                  </svg>
                  <p className="text-lg font-medium leading-relaxed">
                    Talent is everywhere — but access to quality training and mentorship is not. We are here to change that.
                  </p>
                </div>

                {/* Three pillars */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                      <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">Hands-on Learning</p>
                    <p className="mt-1 text-xs text-slate-500">Work on real-world datasets, reports, and analytics problems.</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                      <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">Mentor-led Cohorts</p>
                    <p className="mt-1 text-xs text-slate-500">Learn directly from industry experts in Data & AI roles.</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                      <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">Career Outcomes</p>
                    <p className="mt-1 text-xs text-slate-500">Build job-ready skills that translate into real opportunities.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= ADVISORS ================= */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">

            <h2 className="text-3xl font-bold text-slate-900 mb-5">Our Team</h2>

            <div className="flex flex-wrap gap-8">
              {/* Leland Shamo */}
              <div className="flex items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm w-full max-w-md">
                <img
                  src="/Advisor1.jpeg"
                  alt="Leland Shamo"
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-brand-200 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold text-slate-900">Leland Shamo</p>
                    <a href="https://www.linkedin.com/in/leland-c-shamo/" target="_blank" rel="noreferrer" aria-label="Leland Shamo on LinkedIn" className="flex-shrink-0 text-[#0A66C2] hover:opacity-75 transition-opacity">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                  <p className="text-sm text-brand-600 font-medium mt-0.5">CEO, Rise With Data, <br/>
Sr. Manager, Talent Acquisition Operations & People Analytics, Renuity</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Ex-Marine and workforce planning leader with 25+ years of experience building recruiting teams and People Analytics models at Renuity, Chewy, Misfits Market, and Carvana.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-5 mt-10">Our Advisors</h2>

            <div className="flex flex-wrap gap-8">
              {/* Leland Shamo */}
              <div className="flex items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm w-full max-w-md">
                <img
                  src="/Chay.png"
                  alt="Chay Farrell Matney"
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-brand-200 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold text-slate-900">Chay Farrell Matney</p>
                    <a href="https://www.linkedin.com/in/cpieper/" target="_blank" rel="noreferrer" aria-label="Chay Farrell Matney on LinkedIn" className="flex-shrink-0 text-[#0A66C2] hover:opacity-75 transition-opacity">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                  <p className="text-sm text-brand-600 font-medium mt-0.5">Director, Human Resources, Griffith Foods</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Strategic HR executive with 17+ years aligning people strategy with business growth and operational transformation across manufacturing, fulfillment, and retail, including roles at Chewy, Ingredion, and Target.
                  </p>
                </div>
              </div>
               <div className="flex items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm w-full max-w-md">
                <img
                  src="/Headshot.png"
                  alt="Chay Farrell Matney"
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-brand-200 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold text-slate-900">Brack Sullivan</p>
                    <a href="https://www.linkedin.com/in/brack-s-3882722/" target="_blank" rel="noreferrer" aria-label="Brack Sullivan on LinkedIn" className="flex-shrink-0 text-[#0A66C2] hover:opacity-75 transition-opacity">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                  <p className="text-sm text-brand-600 font-medium mt-0.5">Head of Talent Acquisition, Lyric
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Global talent acquisition executive with 20+ years of experience in enterprise talent strategy, workforce planning, and building high-performing recruiting teams across GitHub, Chewy, Disney, and The Home Depot.
                  </p>
                </div>
              </div>
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
            href="/contact"
            className="mt-8 inline-block rounded-xl bg-brand-600 px-8 py-3 text-sm font-medium text-white hover:bg-brand-700"
          >
            Get Started
          </a>

        </section>

      </main>
      <Footer />
    </>
  );
}