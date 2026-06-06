import { communityStats } from '../homepage.data';

export function CommunitySection() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Community
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              You don't learn alone. You grow with a cohort.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              Every fellow joins a tight-knit cohort of 30 analysts. You tackle the same
              projects, hold each other accountable, and build a professional network
              that lasts far beyond the 8 weeks.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                'Weekly live sessions with your full cohort',
                'Private Slack workspace for daily support',
                'Alumni network with 3,400+ data professionals',
                'Hiring manager networking events each quarter',
                'Office hours with instructors every Friday',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="/contact"
              className="mt-10 inline-block rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Apply to Join
            </a>
          </div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-1">
            {communityStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <p className="text-5xl font-bold text-white">{stat.value}</p>
                <p className="mt-3 text-slate-400">{stat.label}</p>
              </div>
            ))}

            <div className="rounded-3xl border border-blue-500/30 bg-blue-600/10 p-8">
              <p className="text-lg font-semibold text-white">
                "The community was the unexpected benefit. I still talk to my cohort every week."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  JK
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Jordan Kim</p>
                  <p className="text-xs text-slate-400">Data Analyst · Google</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
