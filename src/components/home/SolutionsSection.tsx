import { Card } from "@/components/ui/card";

const solutions = [
  {
    title: "Pharmaceutical Companies",
    bullets: [
      "Drug discovery",
      "Biomarker research",
      "Clinical development",
      "Real-world evidence",
    ],
  },
  {
    title: "Biotechnology Companies",
    bullets: [
      "Target validation",
      "Translational research",
      "Rare disease cohorts",
      "Multi-omics studies",
    ],
  },
  {
    title: "Healthcare AI Companies",
    bullets: [
      "Model training",
      "External validation",
      "Bias and generalizability studies",
      "Multi-modal datasets",
    ],
  },
  {
    title: "CROs",
    bullets: [
      "Study feasibility",
      "Cohort identification",
      "Site and patient landscape assessment",
      "Evidence generation",
    ],
  },
  {
    title: "Researchers",
    bullets: [
      "Multi-institution collaboration",
      "Population research",
      "Grant-supported studies",
      "Publication-focused evidence",
    ],
  },
];

export function SolutionsSection() {
  return (
    <section id="partners" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Built for Life Sciences and Healthcare AI</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            BCONZ helps research teams move from a scientific question to a feasible, governed and research-ready data cohort.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {solutions.map((item) => (
            <Card key={item.title} className="group transition hover:-translate-y-1 hover:shadow-glow focus-within:-translate-y-1 focus-within:shadow-glow">
              <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="/solutions" className="inline-flex rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
            Explore Solutions
          </a>
        </div>
      </div>
    </section>
  );
}
