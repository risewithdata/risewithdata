import { companyLogos } from '../homepage.data';

export function TrustedCompanies() {
  return (
    <section className="border-y border-slate-100 bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
         Technologies covered are used by most Fortune 500 companies.
        </p>
        <div className="mt-8 overflow-hidden">
          <div className="marquee flex items-center gap-12 whitespace-nowrap">
            {[...companyLogos, ...companyLogos].map((company, i) => (
              <span
                key={`${company}-${i}`}
                className="inline-flex h-9 min-w-fit items-center justify-center rounded-lg px-5 text-sm font-bold tracking-wide text-slate-400 transition hover:text-slate-700"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
