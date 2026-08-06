import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading, Label, Subheading } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Icon } from "@/components/ui/icon";

const partners = [
  {
    title: "Hospitals",
    icon: "clinical" as const,
    description: "Support responsible research collaboration across health system networks and academic medical centers.",
    opportunities: ["Clinical program development", "Cohort validation", "Outcome research"],
  },
  {
    title: "Cancer Centers",
    icon: "trust" as const,
    description: "Participate in oncology research through structured data partnerships and tumor registry alignment.",
    opportunities: ["Biomarker studies", "Clinical trial matching", "Translational oncology"],
  },
  {
    title: "Diagnostic Laboratories",
    icon: "data" as const,
    description: "Work with BCONZ to connect laboratory insights with clinical research programs and study design.",
    opportunities: ["Lab-based research", "Diagnostic validation", "Result-driven cohorts"],
  },
  {
    title: "Genomics Laboratories",
    icon: "genomics" as const,
    description: "Enable molecular research collaborations that pair genomic findings with healthcare outcomes.",
    opportunities: ["Genomic discovery", "Variant research", "Precision study support"],
  },
  {
    title: "Biobanks",
    icon: "biospecimen" as const,
    description: "Align specimen resources with research programs while preserving provenance and oversight.",
    opportunities: ["Sample-based studies", "Biomarker research", "Translational partnerships"],
  },
  {
    title: "Research Institutes",
    icon: "research" as const,
    description: "Advance scientific collaboration by connecting institutional research with trusted healthcare data partners.",
    opportunities: ["Collaborative research", "Study design", "Publication support"],
  },
  {
    title: "Academic Medical Centers",
    icon: "partnership" as const,
    description: "Partner on institution-led research programs that integrate clinical and translational science.",
    opportunities: ["Grant-supported studies", "Clinical insights", "Interdisciplinary research"],
  },
  {
    title: "Healthcare Networks",
    icon: "governance" as const,
    description: "Build collaborative research programs across connected provider organizations and systems.",
    opportunities: ["Network studies", "Population health research", "Data stewardship"],
  },
];

const reasons = [
  {
    title: "Research Collaboration",
    description: "Participate in scientific research projects with life sciences organizations.",
  },
  {
    title: "Institutional Visibility",
    description: "Increase participation in national and international research initiatives.",
  },
  {
    title: "Research Readiness",
    description: "Improve understanding of available clinical and molecular data assets.",
  },
  {
    title: "Responsible Governance",
    description: "Project-specific governance and institutional oversight remain central to every engagement.",
  },
  {
    title: "Knowledge Sharing",
    description: "Collaborate with researchers, clinicians and data scientists across disciplines.",
  },
  {
    title: "Long-Term Value",
    description: "Support sustainable research collaborations that benefit institutions, researchers and future patients.",
  },
];

const processSteps = [
  "Initial Discussion",
  "Institution Assessment",
  "Data Readiness Review",
  "Governance Planning",
  "Project Matching",
  "Long-Term Collaboration",
];

const readiness = [
  "Clinical Data",
  "Genomics",
  "Multi-omics",
  "Imaging",
  "Digital Pathology",
  "Biospecimens",
  "Real World Data",
  "Metadata & Cohort Discovery",
];

const governance = [
  {
    title: "Institution-Led Decisions",
    description: "Each project is reviewed in accordance with institutional governance processes.",
  },
  {
    title: "Purpose-Specific Collaboration",
    description: "Research objectives define project scope and data requirements.",
  },
  {
    title: "Privacy by Design",
    description: "Support responsible handling of healthcare information throughout the research lifecycle.",
  },
  {
    title: "Transparent Engagement",
    description: "Clear documentation, defined responsibilities and collaborative decision-making.",
  },
];

const benefits = [
  "Advance Research",
  "Support Precision Medicine",
  "Expand Scientific Collaboration",
  "Increase Research Visibility",
  "Strengthen Institutional Capability",
  "Enable Multi-Institution Studies",
];

const faqs = [
  {
    question: "Who can become a BCONZ Data Partner?",
    answer:
      "Hospitals, cancer centers, laboratories, biobanks, research institutes and healthcare networks can partner with BCONZ through institution-led collaboration.",
  },
  {
    question: "Can multiple hospitals participate?",
    answer:
      "Yes. BCONZ supports multi-institution studies that preserve each partner's governance and research priorities.",
  },
  {
    question: "Does BCONZ require exclusive partnerships?",
    answer:
      "No. Partnerships are tailored to each institution's goals and do not require exclusivity on this public-facing page.",
  },
  {
    question: "How are research projects evaluated?",
    answer:
      "Projects are reviewed for scientific fit, institutional governance, and available data assets before collaboration begins.",
  },
  {
    question: "How is governance maintained?",
    answer:
      "Governance is maintained through collaborative planning, project-specific oversight and transparent engagement practices.",
  },
  {
    question: "Can institutions decide which projects to support?",
    answer:
      "Yes. Institutions retain decision-making authority over the projects they choose to support and the research scope.",
  },
];

export function DataPartnersPage() {
  return (
    <main>
      <Section className="bg-slate-50">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Healthcare Organizations</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Partner with BCONZ to Advance Scientific Discovery
              </h1>
              <p className="text-lg leading-8 text-slate-700">
                BCONZ collaborates with hospitals, laboratories and research institutions to support responsible healthcare data partnerships that accelerate scientific research while respecting institutional governance and patient privacy.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="primary" size="large" as="a" href="/contact">
                  Become a Data Partner
                </Button>
                <Button variant="secondary" size="large" as="a" href="/contact">
                  Schedule a Discussion
                </Button>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-6">
                <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-sm">
                  <p className="text-sm uppercase tracking-[0.24em] text-teal-300">Institution-led partnerships</p>
                  <p className="mt-4 text-base leading-7">
                    Collaborations are built around scientific goals, governance and lasting research value rather than transactional data exchange.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Respectful collaboration</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Research partnerships designed to align with institutional policies and priorities.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Scientific focus</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Support for research programs that advance healthcare knowledge and patient-centered science.
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
            <Label>Who Can Partner</Label>
            <Heading>Trusted healthcare organizations that collaborate with BCONZ</Heading>
            <Subheading>
              BCONZ works with hospitals, laboratories, biobanks and research institutes through governance-first partnership models.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner) => (
              <Card key={partner.title} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-50 text-slate-950">
                  <Icon name={partner.icon} className="h-6 w-6" />
                </div>
                <h2 className="mt-6 text-xl font-semibold text-slate-950">{partner.title}</h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">{partner.description}</p>
                <div className="mt-5 space-y-2 text-sm leading-6 text-slate-600">
                  <p className="font-semibold text-slate-900">Collaboration opportunities</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {partner.opportunities.map((opportunity) => (
                      <li key={opportunity}>{opportunity}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Why Partner with BCONZ</Label>
            <Heading>Building Long-Term Scientific Partnerships</Heading>
            <Subheading>
              Purposeful engagement for healthcare organizations that want to support collaborative research with trusted governance.
            </Subheading>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <Card key={reason.title} className="p-6">
                <p className="text-lg font-semibold text-slate-950">{reason.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{reason.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>How Partnerships Work</Label>
            <Heading>Research collaboration built through a premium timeline</Heading>
            <Subheading>
              Every partnership is tailored to the institution&apos;s governance framework, research priorities and available data assets.
            </Subheading>
          </div>

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white text-lg font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-base font-semibold text-slate-950">{step}</p>
                  {index < processSteps.length - 1 ? <span className="ml-auto text-2xl text-slate-300">↓</span> : null}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Data Readiness</Label>
            <Heading>Preparing Research-Ready Healthcare Data</Heading>
            <Subheading>
              BCONZ helps institutions understand and organize available data assets without implying that data must leave the institution.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {readiness.map((item) => (
              <Card key={item} className="p-6">
                <p className="text-lg font-semibold text-slate-950">{item}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Governance Principles</Label>
            <Heading>Principles for responsible healthcare research partnerships</Heading>
            <Subheading>
              BCONZ partners with institutions through governance practices that respect institutional review and research purpose.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {governance.map((item) => (
              <Card key={item.title} className="p-6">
                <p className="text-lg font-semibold text-slate-950">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Partnership Benefits</Label>
            <Heading>Benefits for institutional research partners</Heading>
            <Subheading>
              Meaningful collaboration without positioning BCONZ as a broker or marketplace.
            </Subheading>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <Card key={item} className="p-6">
                <p className="text-lg font-semibold text-slate-950">{item}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Frequently Asked Questions</Label>
            <Heading>Questions institutions ask about partnership</Heading>
            <Subheading>
              Clear answers to governance, collaboration and research evaluation questions.
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

      <Section className="bg-slate-950 text-white">
        <Container>
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">
              Let&apos;s Build the Future of Healthcare Research Together
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Button variant="primary" size="large" as="a" href="/contact">
                Become a Data Partner
              </Button>
              <Button variant="secondary" size="large" as="a" href="/contact">
                Contact Our Partnership Team
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
