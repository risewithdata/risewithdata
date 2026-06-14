import { NavigationBar } from '@features/home/components/NavigationBar.client';
import { Footer } from '@features/home/components/Footer';
import { VolunteerForm } from '@features/volunteer/components/VolunteerForm.client';

export const metadata = {
  title: 'Join as Instructor — RiseWithData',
  description: 'Teach Power BI and data analytics to the next generation of data professionals.',
};

const roles = [
  {
    title: 'Cohort Instructor',
    desc: 'Lead an entire 8-week cohort from kickoff through Demo Day with weekly live sessions, assignments, and real-world projects.',
    time: '4–6 hrs / week',
    badge: 'Most Impactful',
  },
  {
    title: 'Guest Instructor',
    desc: 'Deliver a focused 1–2 session deep dive on a specific Power BI topic — DAX, data modeling, report design, or storytelling.',
    time: '2–4 hrs / session',
    badge: 'Low Commitment',
  },
  {
    title: 'Curriculum Designer',
    desc: 'Help build and refine course materials, project briefs, and assessment rubrics that stay current with industry standards.',
    time: '3–5 hrs / module',
    badge: 'Behind the Scenes',
  },
  {
    title: '1-on-1 Mentor',
    desc: 'Guide individual fellows through their capstone projects and career transitions with scheduled office-hour sessions.',
    time: '1–2 hrs / week',
    badge: 'High Touch',
  },
];

const benefits = [
  { icon: '🏆', title: 'Build Your Brand', desc: 'Get featured on our website and LinkedIn as a RiseWithData instructor, boosting your credibility and visibility.' },
  { icon: '🌐', title: 'Expand Your Network', desc: 'Join 45+ instructors and 3,400+ alumni — a community of data professionals growing fast.' },
  { icon: '💡', title: 'Deepen Your Expertise', desc: 'Teaching reinforces mastery. Instructors consistently report stronger command of Power BI after their first cohort.' },
  { icon: '🎯', title: 'Real-World Impact', desc: 'Your sessions directly help career-changers land data analyst roles at top companies.' },
];

const requirements = [
  '2+ years of hands-on Power BI, data analytics, or BI reporting experience',
  'Ability to explain technical concepts clearly to non-technical learners',
  'Availability for at least one of the roles listed above',
  'Professional LinkedIn profile and resume',
];

export default function InstructorPage() {
  return (
    <>
    <NavigationBar />
    <main className="bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center text-white">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Teach With Us
          </span>
          <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
            Share Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Expertise
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Become a RiseWithData instructor and help ambitious learners break into
            data analytics — while growing your own professional brand.
          </p>

          <div className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {[
              { value: '45+', label: 'Active instructors' },
              { value: '3,400+', label: 'Fellows trained' },
              { value: '8 wks', label: 'Cohort length' },
            ].map((s) => (
              <div key={s.label} className="bg-slate-900/80 px-6 py-5">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Teaching Roles</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Find the right fit for your schedule</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Whether you have a full cohort to give or just an afternoon, we have a role for you.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <div key={role.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="mb-4 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {role.badge}
                </span>
                <p className="font-bold text-slate-900">{role.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{role.desc}</p>
                <div className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  ⏱ {role.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Benefits ── */}
      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-24 lg:grid-cols-5 lg:px-8">

        {/* Left */}
        <div className="space-y-10 lg:col-span-2">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Why Teach Here</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Give back. Grow further.</h2>
            <p className="mt-4 leading-relaxed text-slate-500">
              Our instructors are practicing data professionals who bring real-world
              experience into the classroom — and take away a stronger skill set in return.
            </p>
          </div>

          <div className="space-y-5">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  {b.icon}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{b.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <p className="font-semibold text-blue-900">What We Look For</p>
            <ul className="mt-3 space-y-2">
              {requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="mt-0.5 text-blue-500">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">What Happens Next</p>
            <ol className="mt-5 space-y-4">
              {[
                'Submit your application below',
                'We review your profile within 3–5 business days',
                'Intro call with our program director',
                'Onboarding, prep materials & your first session',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right — form */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 px-8 py-7 text-white">
              <h2 className="text-xl font-bold">Instructor Application</h2>
              <p className="mt-1 text-sm text-slate-300">
                Takes less than 2 minutes. We'll reach out within 3–5 business days.
              </p>
            </div>
            <div className="p-8">
              <VolunteerForm />
            </div>
          </div>
        </div>

      </section>
    </main>
    <Footer />
    </>
  );
}
