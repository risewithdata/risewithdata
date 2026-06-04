import { Button } from '@shared/ui/Button';

const metrics = [
  { label: 'Growth rate', value: '3x career acceleration' },
  { label: 'Graduate success', value: '91% job placements' },
  { label: 'Cohorts', value: '12 cohorts per year' }
];

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-r from-violet-200 via-blue-100 to-white opacity-80 blur-2xl" />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
              Premium product leadership training for ambitious teams
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Build the product career you want with world-class training.
              </h1>
              <p className="text-lg leading-8 text-slate-600">
                Learn from senior product leaders, master practical frameworks, and accelerate into roles at top companies with a curated learning journey.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button as="a" href="#final-cta" variant="primary">
                Get Started
              </Button>
              <Button as="a" href="#programs" variant="secondary">
                View Programs
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute right-0 top-16 hidden h-56 w-56 rounded-full bg-violet-100 blur-3xl lg:block" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.4),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.25),_transparent_20%)]" />
              <div className="relative space-y-6 text-white">
                <div className="flex items-center gap-3 text-sm font-medium text-blue-200">
                  <span className="inline-flex h-3 w-3 rounded-full bg-lime-400" />
                  Live product cohort in progress
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-6 shadow-inner shadow-slate-900/20">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Performance dashboard</span>
                    <span>Today</span>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white/10 p-4">
                      <p className="text-3xl font-semibold">92%</p>
                      <p className="mt-2 text-sm text-slate-400">Course completion</p>
                    </div>
                    <div className="rounded-3xl bg-white/10 p-4">
                      <p className="text-3xl font-semibold">4.9</p>
                      <p className="mt-2 text-sm text-slate-400">Average rating</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Program focus</p>
                  <p className="mt-3 text-xl font-semibold text-white">Strategy, roadmap, launch confidence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
