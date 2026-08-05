import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const modalities = [
  {
    name: "Longitudinal Clinical Data",
    description:
      "Diagnoses, treatments, medications, laboratory results, procedures, follow-up and outcomes across time.",
    icon: "clinical" as const,
  },
  {
    name: "Genomics",
    description: "Germline and somatic sequencing data linked to relevant clinical context where available.",
    icon: "genomics" as const,
  },
  {
    name: "Multi-omics",
    description: "Transcriptomic, proteomic and other molecular data for biomarker and disease-mechanism research.",
    icon: "multiomics" as const,
  },
  {
    name: "Medical Imaging",
    description: "Research-ready imaging metadata and approved image datasets for discovery, validation and AI development.",
    icon: "imaging" as const,
  },
  {
    name: "Digital Pathology",
    description: "Pathology images, annotations and diagnostic context for computational pathology and translational research.",
    icon: "pathology" as const,
  },
  {
    name: "Biospecimen-Linked Data",
    description: "Clinical and molecular information associated with tissue, blood, plasma, DNA, RNA or other approved samples.",
    icon: "biospecimen" as const,
  },
  {
    name: "Real-World Data",
    description: "Treatment pathways, longitudinal outcomes and routine-care evidence to support clinical and market research.",
    icon: "realworld" as const,
  },
];

export function DataModalitiesSection() {
  return (
    <section id="solutions" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Research-Ready Data Across the Patient Journey</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Build fit-for-purpose research cohorts using complementary clinical, molecular and observational data.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {modalities.map((item) => (
            <Card key={item.name} className="group transition hover:-translate-y-1 hover:shadow-glow focus-within:-translate-y-1 focus-within:shadow-glow">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white transition group-hover:bg-teal-600">
                <Icon name={item.icon} />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{item.name}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="/data" className="inline-flex rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
            Explore Data Capabilities
          </a>
        </div>
      </div>
    </section>
  );
}
