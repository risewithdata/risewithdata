import { journeySteps } from '../homepage.data';

export function LearningJourney() {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Learning journey</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A clear path to your next product role.</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">Three intentional steps designed to guide your learning, application, and career launch.</p>
        </div>
        <div className="relative mt-16 grid gap-10 lg:grid-cols-3">
          <div className="absolute left-1/2 top-24 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-cyan-400 via-slate-400/40 to-transparent lg:block" />
          {journeySteps.map((step, index) => (
            <div key={step.title} className="relative rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 shadow-xl backdrop-blur-xl">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 text-2xl">
                {step.icon}
              </div>
              <h3 className="text-2xl font-semibold text-white">{step.title}</h3>
              <p className="mt-4 text-slate-300">{step.description}</p>
              <div className="mt-6 flex items-center gap-3 text-sm text-cyan-300">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                Step {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
