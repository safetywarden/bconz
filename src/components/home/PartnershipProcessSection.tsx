const steps = [
  {
    title: "Define the Research Need",
    description:
      "Clarify disease area, cohort criteria, data modalities, geography and scientific objectives.",
  },
  {
    title: "Assess Feasibility",
    description:
      "Identify relevant partner data assets and determine indicative cohort availability.",
  },
  {
    title: "Establish Governance",
    description:
      "Complete confidentiality, permitted-use, institutional and project review requirements.",
  },
  {
    title: "Develop the Cohort",
    description:
      "Prepare, curate and quality-check the approved research dataset.",
  },
  {
    title: "Deliver Securely",
    description:
      "Provide data or approved research outputs through the agreed secure mechanism.",
  },
  {
    title: "Support Research",
    description:
      "Assist with clarification, data documentation and future collaboration where agreed.",
  },
];

export function PartnershipProcessSection() {
  return (
    <section id="process" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">From Research Question to Approved Data Collaboration</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            From Research Question to Approved Data Collaboration
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-950 text-white text-sm font-semibold">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-7 text-slate-600">
          Project steps may vary based on jurisdiction, institution, data modality and research purpose.
        </p>
      </div>
    </section>
  );
}
