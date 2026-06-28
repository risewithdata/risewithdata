'use client';

import { NavigationBar } from '@features/home/components/NavigationBar.client';
import { DonateForm } from '@features/donate/components/DonateForm.client';
import { Footer } from '@features/home/components/Footer';

const impactItems = [
  {
    amount: '$25',
    icon: '📚',
    title: 'Covers learning materials',
    desc: 'Funds one week of datasets, project templates, and curriculum resources for a fellow.',
  },
  {
    amount: '$50',
    icon: '🎯',
    title: 'Sponsors a live session',
    desc: 'Covers the cost of a 2-hour live instruction session for an entire cohort of 30 analysts.',
  },
  {
    amount: '$100',
    icon: '🚀',
    title: 'Funds a scholarship seat',
    desc: 'Contributes toward a partial scholarship for a career-switcher who can\'t afford the full fee.',
  },
  {
    amount: '$250',
    icon: '🌟',
    title: 'Full scholarship contribution',
    desc: 'Your contribution unlocks access for a learner from an underrepresented community in data.',
  },
];

const stats = [
  { value: '3,400+', label: 'Fellows trained' },
  { value: '87%',    label: 'Hired within 6 months' },
  { value: '120+',   label: 'Scholarships awarded' },
  { value: '$0',     label: 'Cost to admin overhead' },
];

const donors = [
  { initials: 'MK', name: 'Maya K.',   amount: '$100/mo', message: 'Data changed my career — I want it to change someone else\'s.' },
  { initials: 'RJ', name: 'Ryan J.',   amount: '$250',    message: 'Proud to support an organization making data careers accessible.' },
  { initials: 'TP', name: 'Tina P.',   amount: '$50/mo',  message: 'Every analyst deserves the right training. Keep going, RiseWithData!' },
];

export default function DonatePage() {
  return (
    <>
      <NavigationBar />

      <main className="bg-white">

        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-6 py-28 text-center text-white">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-300">
              Support Data Education
            </span>
            <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
              Help someone launch their{' '}
              <span className="bg-gradient-to-r from-brand-400 to-brand-400 bg-clip-text text-transparent">
                data career
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Your donation funds scholarships, curriculum development, and live instruction
              for professionals who can't afford the full fellowship fee — giving them a
              real shot at breaking into data analytics.
            </p>

            {/* Quick stat row */}
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-slate-900/80 px-6 py-5">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== IMPACT + FORM ===== */}
        <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-5 lg:px-8">

          {/* Left — impact content */}
          <div className="space-y-16 lg:col-span-3">

            {/* What your money does */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                Your Impact
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Every dollar goes directly to learners
              </h2>
              <p className="mt-4 text-slate-500">
                RiseWithData is a mission-driven organization. 100% of donations fund
                fellowship scholarships and curriculum — zero goes to administrative overhead.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {impactItems.map((item) => (
                  <div
                    key={item.amount}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="rounded-xl bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
                        {item.amount}
                      </span>
                    </div>
                    <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission statement */}
            <div className="rounded-3xl bg-slate-950 p-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
                Our Mission
              </p>
              <p className="mt-4 text-xl font-semibold leading-relaxed">
                "Data skills should not be gated by financial privilege. We believe
                everyone deserves access to world-class training and the career that
                comes with it."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold">
                  RD
                </div>
                <div>
                  <p className="text-sm font-semibold">RiseWithData Team</p>
                  <p className="text-xs text-slate-400">risewithdatausa@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Donor wall */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                Recent Donors
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Join a community of supporters
              </h2>
              <div className="mt-8 space-y-4">
                {donors.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 text-sm font-bold text-white">
                      {d.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900">{d.name}</p>
                        <span className="rounded-full bg-green-50 px-3 py-0.5 text-xs font-semibold text-green-700">
                          {d.amount}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">"{d.message}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right — donation form */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                {/* Card header */}
                <div className="bg-gradient-to-br from-brand-600 to-brand-700 px-6 py-6 text-white">
                  <h2 className="text-xl font-bold">Make a Donation</h2>
                  <p className="mt-1 text-sm text-brand-100">
                    Secure · Tax-deductible · 100% to scholars
                  </p>
                </div>

                <div className="p-6">
                  <DonateForm />
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
                <span>🔒 SSL Secured</span>
                <span>📋 Tax-deductible</span>
                <span>✉ Receipt emailed</span>
              </div>
            </div>
          </aside>

        </section>

        {/* ===== HOW FUNDS ARE USED ===== */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                Transparency
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Where every dollar goes
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                { pct: '70%', label: 'Fellowship Scholarships', color: 'bg-brand-600',   desc: 'Subsidizing tuition for learners who demonstrate need' },
                { pct: '20%', label: 'Curriculum & Instructors', color: 'bg-violet-600', desc: 'Developing new modules and compensating expert instructors' },
                { pct: '10%', label: 'Community & Events',       color: 'bg-slate-700',  desc: 'Hosting networking events, alumni meetups, and office hours' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-end gap-3">
                    <p className="text-5xl font-bold text-slate-900">{item.pct}</p>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.pct }} />
                  </div>
                  <p className="mt-4 font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
              Every contribution counts
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              Ready to change someone's career trajectory?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
              Even a one-time $25 donation helps us keep the lights on for a learner
              who would otherwise give up on their data career dream.
            </p>
            <a
              href="#donate-form"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-8 inline-block rounded-xl bg-brand-600 px-10 py-4 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-700"
            >
              Donate Now
            </a>
            <p className="mt-4 text-sm text-slate-400">
              Questions?{' '}
              <a href="mailto:risewithdatausa@gmail.com" className="text-brand-600 hover:underline">
                risewithdatausa@gmail.com
              </a>
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
