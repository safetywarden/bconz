export function DataPartnersSection() {
  const benefits = [
    {
      title: "Research collaboration",
      description: "Connect with approved scientific and industry research opportunities.",
    },
    {
      title: "Data readiness support",
      description: "Organize metadata, data availability and cohort feasibility without exposing patient-level data publicly.",
    },
    {
      title: "Governance-first engagement",
      description: "Support project-specific review, contracting, institutional approvals and permitted-use controls.",
    },
    {
      title: "Scientific and commercial value",
      description: "Create opportunities for research participation, evidence generation and mutually agreed commercial models.",
    },
  ];

  return (
    <section id="why-bconz" className="bg-slate-950 py-20 sm:py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">For Healthcare Organizations</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Turn Healthcare Knowledge into Responsible Research Impact
            </h2>
            <p className="text-base leading-8 text-slate-200">
              BCONZ helps healthcare organizations understand their data assets, evaluate research readiness and engage with qualified life sciences opportunities while maintaining institutional oversight and purpose-specific governance.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="/data-partners" className="inline-flex w-full items-center justify-center rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 sm:w-auto">
                Become a Data Partner
              </a>
              <a href="/data-partners#process" className="inline-flex w-full items-center justify-center rounded-full border border-teal-300 bg-transparent px-6 py-3 text-sm font-semibold text-teal-300 transition hover:bg-teal-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 sm:w-auto">
                Learn How Partnerships Work
              </a>
            </div>
          </div>
          <div className="grid gap-4 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
