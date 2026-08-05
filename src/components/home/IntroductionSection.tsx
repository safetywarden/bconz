export function IntroductionSection() {
  return (
    <section id="data" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-600">Trusted Healthcare Data Partnerships</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            BCONZ works with hospitals, laboratories, biobanks and research institutions to prepare high-quality healthcare data for approved scientific use.
          </h2>
          <p className="text-base leading-8 text-slate-700">
            We help life sciences teams define cohorts, assess feasibility and access research-ready data through clear governance, institutional oversight and purpose-specific agreements.
          </p>
          <p className="text-base leading-8 text-slate-700">
            Our role is to create trusted connections between the organizations that generate healthcare knowledge and the teams working to transform it into better therapies, diagnostics and evidence.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950/5 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Who we serve</p>
            <ul className="mt-6 space-y-4 text-slate-700">
              <li>Hospitals and health systems</li>
              <li>Diagnostic and genomics laboratories</li>
              <li>Biobanks and research institutes</li>
              <li>Life sciences and healthcare AI teams</li>
            </ul>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">What we support</p>
            <ul className="mt-6 space-y-4 text-slate-700">
              <li>Research-ready data curation</li>
              <li>Cohort feasibility assessment</li>
              <li>Governed access and controls</li>
              <li>Purpose-specific collaboration pathways</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
