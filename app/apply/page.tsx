import { NavigationBar } from '@features/home/components/NavigationBar.client';
import { Footer } from '@features/home/components/Footer';
import { ApplyForm } from '@features/apply/components/ApplyForm.client';

export const metadata = {
  title: 'Apply — RiseWithData',
  description: 'Apply to join the RiseWithData Power BI Data Analyst Fellowship program.',
};

const steps = [
  {
    step: '01',
    title: 'Submit Your Application',
    body: 'Fill out the form with your details and upload your resume. Takes less than 5 minutes.',
  },
  {
    step: '02',
    title: 'Application Review',
    body: 'Our team reviews your application within 3–5 business days and reaches out via email.',
  },
  {
    step: '03',
    title: 'Orientation & Onboarding',
    body: 'Accepted fellows receive a welcome kit, cohort schedule, and access to learning materials.',
  },
  {
    step: '04',
    title: 'Start Learning',
    body: 'Join live sessions, complete hands-on projects, and build a portfolio employers notice.',
  },
];

const perks = [
  { icon: '📊', label: 'Power BI Mastery', desc: 'From basics to advanced DAX and data modeling.' },
  { icon: '🤝', label: 'Mentorship', desc: 'Guidance from seasoned data professionals.' },
  { icon: '💼', label: 'Career Support', desc: 'Resume reviews, mock interviews, and job referrals.' },
  { icon: '🏅', label: 'Certification', desc: 'Earn a recognized fellowship certificate upon completion.' },
];

export default function ApplyPage() {
  return (
    <>
    <NavigationBar />
    <main className="bg-slate-50">

      {/* ── Hero ── */}
      <section className="bg-[#0f172a] px-6 py-20 text-center text-white lg:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-400">
          Applications Open
        </p>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Apply to the <span className="text-brand-400">RiseWithData</span> Fellowship
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-slate-300">
          Gain real-world Power BI skills, hands-on project experience, and career support — at no cost to you.
        </p>

        {/* stats */}
        <div className="mx-auto mt-10 flex max-w-lg flex-wrap justify-center gap-8">
          {[
            { value: '100%', label: 'Free Fellowship' },
            { value: '12 wks', label: 'Program Duration' },
            { value: '500+', label: 'Fellows Placed' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">What You'll Get</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div
              key={p.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
            >
              <div className="mb-3 text-4xl">{p.icon}</div>
              <h3 className="font-semibold text-slate-900">{p.label}</h3>
              <p className="mt-2 text-sm text-slate-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main content: form + sidebar ── */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">

          {/* LEFT: process + what happens next */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-slate-900">Application Process</h2>
              <ol className="space-y-6">
                {steps.map((s) => (
                  <li key={s.step} className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{s.title}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-6">
              <h3 className="font-semibold text-brand-900">Who Should Apply?</h3>
              <ul className="mt-3 space-y-2 text-sm text-brand-800">
                {[
                  'Career changers entering data analytics',
                  'Recent graduates seeking practical skills',
                  'Professionals looking to upskill in Power BI',
                  'Anyone passionate about data-driven decisions',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-1 text-xl font-bold text-slate-900">Student Application</h2>
              <p className="mb-7 text-sm text-slate-500">
                All fields are required. We'll review and get back to you within 3–5 business days.
              </p>
              <ApplyForm />
            </div>
          </div>

        </div>
      </section>

    </main>
    <Footer />
    </>
  );
}
