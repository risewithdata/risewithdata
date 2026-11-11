export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)]" />

      <div className="mx-auto max-w-7xl px-6 pb-8 pt-8 lg:px-8 lg:pt-12">

        {/* Eyebrow */}
       

        {/* Headline */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="whitespace-nowrap text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-5xl">
            Build Real {' '}
            <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              Data Analyst
            </span>{' '}
            Skills in 10 weeks
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-500">
            Learn live, build real projects. Create Power BI reports and end-to-end fabric projects hands-on.
          </p>
        </div>

        {/* CTAs */}
    

        {/* Stats bar */}
     {/*    <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: '3,400+', label: 'Fellows trained' },
            { value: '4.9 ★', label: 'Average rating' },
            { value: '91%',   label: 'Completion rate' },
            { value: '87%',   label: 'Hired within 6 mo.' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div> */}

        {/* Featured program card */}
        

      </div>
    </section>
  );
}
