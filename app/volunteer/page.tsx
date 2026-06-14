import { NavigationBar } from '@features/home/components/NavigationBar.client';
import { Footer } from '@features/home/components/Footer';
import { VolunteerForm } from '@features/volunteer/components/VolunteerForm.client';

export const metadata = {
  title: 'Volunteer With Us — RiseWithData',
  description: 'Support the RiseWithData community through mentoring, event coordination, and outreach.',
};

const roles = [
  {
    title: 'Community Manager',
    desc: 'Moderate our Discord, welcome new fellows, spark discussions, and keep the community engaged throughout each cohort.',
    time: '3–5 hrs / week',
    badge: 'Community',
  },
  {
    title: 'Event Coordinator',
    desc: "Plan and run virtual networking events, career panels, and Demo Day celebrations that celebrate our fellows' achievements.",
    time: '2–4 hrs / event',
    badge: 'Events',
  },
  {
    title: 'Curriculum Reviewer',
    desc: 'Review learning materials, provide feedback on project briefs, and flag outdated content to keep the curriculum sharp.',
    time: '2–3 hrs / module',
    badge: 'Content',
  },
  {
    title: 'Outreach Volunteer',
    desc: 'Help spread the word about RiseWithData through social media, partnerships with universities, and community organizations.',
    time: 'Flexible',
    badge: 'Marketing',
  },
];

const benefits = [
  { icon: '🌱', title: 'Make a Real Difference', desc: 'Your time and energy directly help underserved communities gain access to data analytics careers.' },
  { icon: '🤝', title: 'Build Lasting Connections', desc: 'Work alongside a passionate team of volunteers, instructors, and data professionals from across the country.' },
  { icon: '📚', title: 'Develop New Skills', desc: 'Gain experience in program coordination, community building, and curriculum development — skills valued by employers.' },
  { icon: '🏅', title: 'Get Recognized', desc: 'Earn a RiseWithData Volunteer Certificate and receive a LinkedIn recommendation from our team.' },
];

const requirements = [
  'Genuine passion for making data careers accessible to everyone',
  "Reliable availability matching your chosen role's time commitment",
  'Strong communication skills (written and verbal)',
  'Self-starter who can work independently in a remote environment',
];

export default function VolunteerPage() {
  return (
    <>
    <NavigationBar />
    <main className="bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center text-white">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Volunteer With Us
          </span>
          <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
            Support the{' '}
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Community
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            You don't have to be a Power BI expert to make a difference. RiseWithData
            volunteers help run the programs, events, and outreach that keep our
            community thriving.
          </p>

          <div className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {[
              { value: '80+', label: 'Active volunteers' },
              { value: '3,400+', label: 'Fellows supported' },
              { value: '15+', label: 'Events per year' },
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
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Volunteer Roles</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Find your way to contribute</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              No data background required — just enthusiasm and a willingness to help.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <div key={role.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="mb-4 inline-block rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
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
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Why Volunteer</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Give your time. Change a life.</h2>
            <p className="mt-4 leading-relaxed text-slate-500">
              Every hour you volunteer helps someone who might never have had access to
              a data career take their first real step toward one.
            </p>
          </div>

          <div className="space-y-5">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl">
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
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6">
            <p className="font-semibold text-teal-900">What We Look For</p>
            <ul className="mt-3 space-y-2">
              {requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-teal-800">
                  <span className="mt-0.5 text-teal-500">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">What Happens Next</p>
            <ol className="mt-5 space-y-4">
              {[
                'Submit your application below',
                'We review your profile within 3–5 business days',
                'Brief welcome call with our volunteer coordinator',
                'Orientation, team intro & your first assignment',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
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
            <div className="bg-gradient-to-br from-slate-900 to-teal-900 px-8 py-7 text-white">
              <h2 className="text-xl font-bold">Volunteer Application</h2>
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
