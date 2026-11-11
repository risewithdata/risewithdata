import { NavigationBar } from '@features/home/components/NavigationBar.client';
import { Footer } from '@features/home/components/Footer';
import { ApplyForm } from '@features/apply/components/ApplyForm.client';

export const metadata = {
  title: 'Apply — RiseWithData',
  description: 'Apply to join the RiseWithData Data Analyst Fellowship program.',
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
    body: 'Our team reviews your application within 2 weeks and reaches out via email.',
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
  { icon: '💼', label: 'Career Support', desc: 'Resume reviews and job referrals.' },
  { icon: '🏅', label: 'Certification', desc: 'Earn a recognized fellowship certificate upon completion.' },
];

export default function ApplyPage() {
  return (
    <>
    <NavigationBar />
    <main className="bg-slate-50">

      {/* ── Main content: form + sidebar ── */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-8">
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
            {/* USA-only notice */}
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
              </svg>
              <p className="text-[12px] text-amber-800">
                <span className="font-semibold">RiseWithData is a U.S.-based organization.</span> Only applicants currently living in the USA will be considered.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-1 text-xl font-bold text-slate-900">Student Application</h2>
              <p className="mb-7 text-sm text-slate-500">
                All fields are required. We'll review and get back to you within 2 weeks.
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
