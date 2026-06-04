import { companyLogos } from '../homepage.data';

export function TrustedCompanies() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Trusted by product teams at</p>
        <div className="mt-8 overflow-hidden rounded-full border border-slate-200 bg-white/90 py-4 shadow-sm">
          <div className="marquee flex items-center gap-12 whitespace-nowrap px-6">
            {companyLogos.map((company) => (
              <span key={company} className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-full bg-slate-100 px-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                {company}
              </span>
            ))}
            {companyLogos.map((company) => (
              <span key={`${company}-copy`} className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-full bg-slate-100 px-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
