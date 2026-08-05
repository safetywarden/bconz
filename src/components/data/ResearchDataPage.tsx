import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading, Label, Subheading } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Icon } from "@/components/ui/icon";

const ecosystemSteps = [
  "Clinical Data",
  "Genomics",
  "Multiomics",
  "Medical Imaging",
  "Digital Pathology",
  "Real World Data",
  "Research Insights",
];

import type { IconName } from "@/components/ui/icon";

const modalities: Array<{
  name: string;
  icon: IconName;
  description: string;
  uses: string[];
}> = [
  {
    name: "Longitudinal Clinical Data",
    icon: "clinical",
    description: "Patient journeys, encounters, diagnoses and treatment histories assembled for research-ready cohorts.",
    uses: ["Outcome studies", "Cohort definition", "Epidemiology"],
  },
  {
    name: "Genomics",
    icon: "genomics",
    description: "Sequencing, variant calls and sample metadata paired with clinical context for precision discovery.",
    uses: ["Target identification", "Biomarker research", "Population genomics"],
  },
  {
    name: "Transcriptomics",
    icon: "multiomics",
    description: "RNA expression profiles linked to sample and clinical data for functional and translational studies.",
    uses: ["Gene expression analysis", "Pathway modeling", "Disease stratification"],
  },
  {
    name: "Proteomics",
    icon: "biospecimen",
    description: "Protein measurements curated with sample provenance for mechanism research and therapeutic discovery.",
    uses: ["Target validation", "Biological signatures", "Drug response modeling"],
  },
  {
    name: "Medical Imaging",
    icon: "imaging",
    description: "Radiology and clinical imaging datasets prepared for advanced visual analytics and AI training.",
    uses: ["Imaging biomarkers", "Model development", "Phenotype extraction"],
  },
  {
    name: "Digital Pathology",
    icon: "pathology",
    description: "High-resolution pathology data aligned with clinical endpoints for research-grade histopathology studies.",
    uses: ["Tissue phenotyping", "Algorithm validation", "Digital diagnostics"],
  },
  {
    name: "Biospecimens",
    icon: "biospecimen",
    description: "Linked specimen metadata and provenance information that support translational research and assay development.",
    uses: ["Biomarker discovery", "Sample tracking", "Translational studies"],
  },
  {
    name: "Real World Data",
    icon: "realworld",
    description: "Claims, device, and longitudinal care records curated to complement clinical and molecular datasets.",
    uses: ["Health economics", "Patient journey analysis", "Post-market research"],
  },
];

const diseaseAreas = [
  "Oncology",
  "Cardiology",
  "Neurology",
  "Rare Diseases",
  "Diabetes",
  "Respiratory",
  "Women's Health",
  "Infectious Disease",
];

const projectSteps = [
  {
    title: "Research Question",
    description: "Define the scientific objective and identify the data needed to answer it.",
  },
  {
    title: "Feasibility Assessment",
    description: "Evaluate data availability, cohort size and alignment to study requirements.",
  },
  {
    title: "Governance Review",
    description: "Confirm research scope, access controls and partner commitments before data preparation.",
  },
  {
    title: "Dataset Preparation",
    description: "Curate, link and standardize data elements for reproducible research workflows.",
  },
  {
    title: "Quality Review",
    description: "Validate completeness, consistency and provenance before secure delivery.",
  },
  {
    title: "Secure Delivery",
    description: "Provide access through trusted channels for approved research teams.",
  },
];

const governanceFeatures = [
  {
    title: "Purpose-specific access",
    description: "Data use is scoped to approved scientific objectives and governed research plans.",
  },
  {
    title: "Institutional oversight",
    description: "Research programs are overseen by clinical and academic stakeholders to preserve trust.",
  },
  {
    title: "Research agreements",
    description: "Agreements define data scope, permitted analysis and collaboration expectations.",
  },
  {
    title: "Privacy by design",
    description: "Data handling is built for privacy with minimal exposure and strong controls.",
  },
];

const audiences = [
  "Pharmaceutical",
  "Biotechnology",
  "Healthcare AI",
  "Academic Research",
  "CRO",
  "Medical Devices",
];

const faqs = [
  {
    question: "Can BCONZ create custom cohorts?",
    answer:
      "Yes. We work with research teams and healthcare partners to define study cohorts from available data modalities while preserving governance and scientific fit.",
  },
  {
    question: "Do you support longitudinal studies?",
    answer:
      "Longitudinal patient histories are a core part of our research-ready datasets, enabling studies over time and outcomes analysis.",
  },
  {
    question: "Can genomic data be linked?",
    answer:
      "Genomic and molecular data can be linked to clinical and outcomes records within trusted data partnerships.",
  },
  {
    question: "How are research projects reviewed?",
    answer:
      "Each project is reviewed for purpose, governance, data suitability and partner commitments before work begins.",
  },
  {
    question: "Can multiple institutions collaborate?",
    answer:
      "Yes. We support collaboration across hospitals, research centers and life sciences organizations through governed data partnerships.",
  },
];

export function ResearchDataPage() {
  return (
    <main>
      <Section className="bg-slate-50">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">
                Research-Ready Healthcare Data
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Trusted Healthcare Data for Scientific Discovery
              </h1>
              <p className="text-lg leading-8 text-slate-700">
                BCONZ helps connect healthcare organizations with life sciences researchers through governed access to research-ready clinical, molecular and real-world healthcare data.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="primary" size="large" as="a" href="/request-data">
                  Request Research Data
                </Button>
                <Button variant="secondary" size="large" as="a" href="/contact">
                  Talk to Our Team
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <div className="inline-flex rounded-3xl bg-slate-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-slate-900">
                    Data ecosystem
                  </div>
                  <p className="text-base leading-7 text-slate-700">
                    A research data platform that brings clinical, molecular, imaging and real-world sources together for purpose-built science.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="bg-slate-50 p-6 text-slate-950 shadow-none border border-slate-200">
                    <p className="font-semibold">Governed access</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Access is granted only for approved scientific studies and defined research use.
                    </p>
                  </Card>
                  <Card className="bg-slate-50 p-6 text-slate-950 shadow-none border border-slate-200">
                    <p className="font-semibold">Research-ready quality</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Data is curated, linked and reviewed to support reliable research workflows.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Research Data Ecosystem</Label>
            <Heading>Modern research combines multiple data modalities</Heading>
            <Subheading>
              The strongest scientific programs connect clinical, molecular, imaging and real-world sources rather than relying on isolated datasets.
            </Subheading>
          </div>

          <div className="mt-12 space-y-4">
            {ecosystemSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  {index + 1}
                </div>
                <p className="text-base font-semibold text-slate-950">{step}</p>
                {index < ecosystemSteps.length - 1 ? (
                  <span className="ml-auto text-2xl leading-none text-slate-300">↓</span>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Research Data Modalities</Label>
            <Heading>Data types built for scientific collaboration</Heading>
            <Subheading>
              Premium datasets arranged for researchers, sponsors and healthcare organizations in an enterprise-ready platform.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modalities.map((item) => (
              <Card key={item.name} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-50 text-slate-950">
                  <Icon name={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <div className="mt-5 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Typical Research Uses</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                    {item.uses.map((use) => (
                      <li key={use}>{use}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Disease Areas</Label>
            <Heading>Research focus across clinical specialties</Heading>
            <Subheading>
              Trusted data partnerships that support oncology, cardiology, neurology and other strategic healthcare research areas.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {diseaseAreas.map((area) => {
              const iconName =
                area === "Oncology"
                  ? "research"
                  : area === "Cardiology"
                  ? "trust"
                  : area === "Neurology"
                  ? "governance"
                  : area === "Rare Diseases"
                  ? "data"
                  : area === "Diabetes"
                  ? "clinical"
                  : area === "Respiratory"
                  ? "imaging"
                  : area === "Women's Health"
                  ? "partnership"
                  : "research";

              return (
                <div key={area} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-50 text-slate-950">
                    <Icon name={iconName} className="h-6 w-6" />
                  </div>
                  <p className="mt-5 text-lg font-semibold text-slate-950">{area}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>How Research Projects Begin</Label>
            <Heading>Structured steps from question to secure delivery</Heading>
            <Subheading>
              A transparent project timeline connects research planning, governance, dataset preparation and delivery.
            </Subheading>
          </div>

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-3">
              {projectSteps.map((step, index) => (
                <div key={step.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white">
                    {index + 1}
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-950">{step.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Responsible Governance</Label>
            <Heading>Governance that supports trusted research partnerships</Heading>
            <Subheading>
              Controls and oversight are built into every research engagement without calling out specific laws.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {governanceFeatures.map((feature) => (
              <Card key={feature.title} className="p-6">
                <p className="text-lg font-semibold text-slate-950">{feature.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Who We Support</Label>
            <Heading>Research and development partners across the enterprise</Heading>
            <Subheading>
              A platform designed for pharmaceutical sponsors, biotech innovators, healthcare AI teams and academic research programs.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => (
              <Card key={audience} className="p-6 text-slate-950">
                <p className="text-xl font-semibold">{audience}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Frequently Requested Data</Label>
            <Heading>Modern FAQs for research-ready datasets</Heading>
            <Subheading>
              Accessible answers to common research questions about cohort design, governance and collaboration.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-4">
            {faqs.map((item) => (
              <details key={item.question} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm" tabIndex={0}>
                <summary className="cursor-pointer text-base font-semibold text-slate-950 outline-none transition hover:text-slate-900">
                  {item.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-950 text-white">
        <Container>
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">
              Ready to Explore Research Data?
            </p>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Connect with BCONZ to shape trusted healthcare research.
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="primary" size="large" as="a" href="/request-data">
                Request Research Data
              </Button>
              <Button variant="secondary" size="large" as="a" href="/data-partners">
                Become a Data Partner
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
