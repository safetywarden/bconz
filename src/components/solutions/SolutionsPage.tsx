import type { IconName } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Heading, Label, Subheading } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Icon } from "@/components/ui/icon";

const audiences: Array<{
  title: string;
  icon: IconName;
  description: string;
  href: string;
}> = [
  {
    title: "Pharmaceutical Companies",
    icon: "clinical",
    description: "Accelerate drug development with research-ready cohorts, biomarkers and trial feasibility support.",
    href: "#pharmaceutical",
  },
  {
    title: "Biotechnology Companies",
    icon: "genomics",
    description: "Support early discovery, target validation and rare disease research with purpose-built datasets.",
    href: "#biotech",
  },
  {
    title: "Healthcare AI",
    icon: "data",
    description: "Power model development and validation with multi-modal healthcare data and clinical labels.",
    href: "#healthcare-ai",
  },
  {
    title: "Contract Research Organizations",
    icon: "partnership",
    description: "Improve study feasibility, site selection and patient identification with data-driven insights.",
    href: "#cro",
  },
  {
    title: "Academic Research",
    icon: "governance",
    description: "Enable collaborative studies and publications with institution-led research data partnerships.",
    href: "#academic",
  },
  {
    title: "Medical Devices",
    icon: "imaging",
    description: "Validate devices and digital biomarkers with imaging, outcomes and wearable data.",
    href: "#medical-devices",
  },
];

const solutions = [
  {
    id: "pharmaceutical",
    title: "Pharmaceutical",
    icon: "research" as const,
    challenges: ["Patient stratification", "Biomarker discovery", "Clinical trial feasibility", "Real-world evidence"],
    support: ["Research-ready cohorts", "Longitudinal data", "Molecular data", "Imaging", "Outcome data"],
    examples: ["Target validation", "Companion diagnostics", "Protocol optimization"],
    cta: "Discuss Your Research",
  },
  {
    id: "biotech",
    title: "Biotechnology",
    icon: "genomics" as const,
    challenges: ["Rare disease research", "Early discovery", "Target validation"],
    support: ["Clinical and molecular datasets", "Multi-omics", "Specialized cohorts"],
    examples: ["Biomarker research"],
    cta: "Discuss Your Research",
  },
  {
    id: "healthcare-ai",
    title: "Healthcare AI",
    icon: "data" as const,
    challenges: ["Model development", "Model validation", "Bias assessment", "Generalizability"],
    support: ["Multi-modal datasets", "Clinical labels", "Imaging", "Pathology", "Longitudinal outcomes"],
    examples: ["Foundation models", "Clinical AI", "Decision support"],
    cta: "Discuss Your Research",
  },
  {
    id: "cro",
    title: "Contract Research Organizations",
    icon: "partnership" as const,
    challenges: ["Study feasibility", "Site selection", "Patient identification"],
    support: ["Feasibility assessment", "Research landscape", "Cohort estimation"],
    examples: ["Study planning", "Protocol alignment", "Operational readiness"],
    cta: "Discuss Your Research",
  },
  {
    id: "academic",
    title: "Academic Research",
    icon: "governance" as const,
    challenges: ["Population studies", "Publications", "Grant-funded research"],
    support: ["Collaborative datasets", "Institutional partnerships", "Scientific oversight"],
    examples: ["Cohort discovery", "Translational analysis", "Published research"],
    cta: "Discuss Your Research",
  },
  {
    id: "medical-devices",
    title: "Medical Devices",
    icon: "imaging" as const,
    challenges: ["Device validation", "Digital biomarkers", "Clinical evidence"],
    support: ["Imaging", "Longitudinal outcomes", "Wearables"],
    examples: ["Validation studies", "Signal development", "Evidence generation"],
    cta: "Discuss Your Research",
  },
];

const researchAreas = [
  "Drug Discovery",
  "Clinical Development",
  "Precision Medicine",
  "Healthcare AI",
  "Digital Health",
  "Real World Evidence",
  "Biomarker Discovery",
  "Companion Diagnostics",
];

const engagementSteps = [
  "Research Discussion",
  "Feasibility",
  "Governance",
  "Project Definition",
  "Dataset Preparation",
  "Delivery",
  "Ongoing Collaboration",
];

const reasons = [
  {
    title: "Trusted Partnerships",
    description: "Enterprise teams work alongside institution-led partners to align goals and preserve trust.",
  },
  {
    title: "Research-ready Data",
    description: "Data is curated, linked and reviewed to support science rather than just transactions.",
  },
  {
    title: "Responsible Governance",
    description: "Access, oversight and review are embedded at every stage of the research workflow.",
  },
  {
    title: "Collaborative Ecosystem",
    description: "Research organizations, healthcare providers and life sciences teams engage in shared, purpose-driven programs.",
  },
];

const faqs = [
  {
    question: "Can projects involve multiple healthcare organizations?",
    answer: "Yes. We support multi-institutional research through governed partnerships and collaborative data programs.",
  },
  {
    question: "Can custom cohorts be defined?",
    answer: "Custom cohorts are defined with research partners and healthcare organizations to meet study objectives while preserving governance.",
  },
  {
    question: "How is governance handled?",
    answer: "Governance is managed through institution-led review, scoped access and research-purpose commitments.",
  },
  {
    question: "Can imaging and genomics be combined?",
    answer: "Yes. We support multi-modal research by combining imaging, molecular and clinical signals within trusted partnerships.",
  },
  {
    question: "How are research priorities discussed?",
    answer: "Priorities are shaped through collaborative planning sessions with research sponsors, clinical partners and data governance teams.",
  },
];

export function SolutionsPage() {
  return (
    <main>
      <Section className="bg-slate-50">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Solutions</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Helping Life Sciences Teams Move Faster with Trusted Healthcare Data Partnerships
              </h1>
              <p className="text-lg leading-8 text-slate-700">
                BCONZ helps pharmaceutical, biotechnology, healthcare AI and research organizations identify research-ready healthcare data through governed, institution-led partnerships that support scientific discovery.
              </p>
              <p className="text-base leading-7 text-slate-700">
                Teams can start by reviewing available <Link href="/data" className="font-semibold text-slate-950 underline underline-offset-4">research data modalities</Link>, submitting a <Link href="/request-data" className="font-semibold text-slate-950 underline underline-offset-4">research data request</Link>, or contacting BCONZ to discuss a specific program.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="primary" size="large" as="a" href="/contact">
                  Discuss Your Research
                </Button>
                <Button variant="secondary" size="large" as="a" href="/data">
                  Explore Research Data
                </Button>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-8">
                <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-sm">
                  <p className="text-sm uppercase tracking-[0.24em] text-teal-300">Trusted partnership model</p>
                  <p className="mt-4 text-lg leading-7">
                    BCONZ supports teams with disciplined research planning, governed access and end-to-end collaboration across health systems and life sciences.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Science first</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">Focus on research outcomes and scientific rigor over transactional data access.</p>
                  </Card>
                  <Card className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Enterprise-ready</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">Designed for regulated workflows with governance, quality review, and collaboration built in.</p>
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
            <Label>Who We Support</Label>
            <Heading>Solutions for every research organization</Heading>
            <Subheading>
              BCONZ partners with pharmaceutical, biotech, AI, CRO, academic and device teams to solve development and research challenges.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => (
              <Card key={audience.title} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-50 text-slate-950">
                  <Icon name={audience.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{audience.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{audience.description}</p>
                <Button variant="secondary" size="normal" as="a" href={audience.href} className="mt-6">
                  Explore Solutions
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Solutions by Industry</Label>
            <Heading>Tailored support for each life sciences organization</Heading>
            <Subheading>
              Each solution block explains the research challenge, BCONZ support model, relevant data modalities and example projects.
            </Subheading>
          </div>

          <div className="mt-12 space-y-10">
            {solutions.map((solution, index) => (
              <div
                key={solution.id}
                className={`grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[0.95fr_1.05fr] ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                    <Icon name={solution.icon} className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">{solution.title}</p>
                  <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-950">Typical challenges</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5">
                        {solution.challenges.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">How BCONZ helps</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5">
                        {solution.support.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                  <div className="grid gap-4 rounded-[1.75rem] bg-slate-50 p-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Relevant healthcare data</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
                        {solution.support.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Typical project examples</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
                        {solution.examples.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="primary" size="normal" as="a" href="/contact">
                      {solution.cta}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Research Areas</Label>
            <Heading>Research and development focus areas supported by BCONZ</Heading>
            <Subheading>
              Practical pathways for drug discovery, precision medicine, healthcare AI research and real-world evidence generation.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {researchAreas.map((area) => (
              <div key={area} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-base font-semibold text-slate-950">{area}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>How Engagement Works</Label>
            <Heading>Partnering through a premium research timeline</Heading>
            <Subheading>
              Organized steps from research discussion through ongoing collaboration, with data partners engaged where institution-led review is required.
            </Subheading>
          </div>

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {engagementSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white text-lg font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-950">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Why Organizations Choose BCONZ</Label>
            <Heading>Trusted partnership advantages for research teams</Heading>
            <Subheading>
              Premium support that connects healthcare data, governance and collaborative research execution.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => (
              <Card key={reason.title} className="p-6">
                <p className="text-lg font-semibold text-slate-950">{reason.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{reason.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Frequently Asked Questions</Label>
            <Heading>Answers to common research partnership questions</Heading>
            <Subheading>
              Clear guidance on collaboration, cohorts, governance and data modalities.
            </Subheading>
          </div>

          <div className="mt-12 space-y-4">
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

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-slate-950 p-10 text-center text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">
              Let&apos;s Discuss Your Next Research Project
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Button variant="primary" size="large" as="a" href="/data">
                Explore Research Data
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
