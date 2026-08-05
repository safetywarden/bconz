export function HomeCtaSection() {
  return (
    <section className="bg-slate-950 py-20 sm:py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">Looking for Research-Ready Healthcare Data?</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Tell us your disease area, cohort criteria, data modalities and research objective.</h2>
            <a href="/request-data" className="mt-8 inline-flex rounded-full bg-teal-500 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">
              Request Research Data
            </a>
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">Represent a Healthcare Organization?</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Explore how your institution can participate in governed research and life sciences collaborations.</h2>
            <a href="/data-partners" className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">
              Become a Data Partner
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
