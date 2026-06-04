import { communityStats } from '../homepage.data';
import { AccentCard } from '@shared/ui/AccentCard';

export function CommunitySection() {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3 lg:items-end">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Community</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Align with a thriving community of product leaders.</h2>
            <p className="text-base leading-7 text-slate-300">Join live events, peer groups, and networking sessions that help you build a trusted professional network.</p>
            <ul className="space-y-4 text-slate-300">
              <li>• Weekly mentor office hours and deep dives</li>
              <li>• Curated networking sessions with hiring managers</li>
              <li>• Active alumni groups and cohort support</li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <div className="grid gap-6 sm:grid-cols-3">
              {communityStats.map((stat) => (
                <AccentCard key={stat.label} title={stat.label} value={stat.value} detail="Verified member outcomes" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
