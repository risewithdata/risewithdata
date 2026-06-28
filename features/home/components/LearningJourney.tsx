import { journeySteps } from '../homepage.data';

export function LearningJourney() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            How It Works
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Three steps to your data analyst career
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            A clear, structured path from application to your first or next analytics role.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-20 grid gap-8 lg:grid-cols-3">
          {/* Connector line */}
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />

          {journeySteps.map((step) => (
            <div
              key={step.step}
              className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              {/* Step number */}
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-xl">
                {step.icon}
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
                Step {step.step}
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">{step.description}</p>

              <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                {step.cta}
                <span className="text-base">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom proof */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {[
            { value: '8 Weeks', label: 'Structured curriculum' },
            { value: '16',      label: 'Live sessions per cohort' },
            { value: '5+',      label: 'Portfolio dashboards' },
            { value: '100%',    label: 'Career support included' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-950 px-8 py-8 text-center">
              <p className="text-3xl font-bold text-white">{item.value}</p>
              <p className="mt-2 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
