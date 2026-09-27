import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { products } from "@/content/platform";
import { Heading, Label, Subheading } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const flow = [
  { step: "Assess", product: "HARM", text: "A data partner learns what its data can support — patients, follow-up, coding, identifiers." },
  { step: "Discover", product: "PIA", text: "Research teams find the provider organisations most likely to hold the data they need." },
  { step: "Match", product: "DIA", text: "Stated research demand is matched to a specific dataset, with every need checked." },
  { step: "Deliver", product: "BCONZ", text: "Governed, institution-led collaboration takes the match to a research-ready dataset." },
];

const principles = [
  {
    title: "Evidence over estimates",
    text: "Every ranking carries the public evidence behind it. Where evidence is absent, the answer is “unknown” — never an imputed value.",
  },
  {
    title: "No manufactured precision",
    text: "Each scoring dimension is tested on every run. One that does not distinguish organisations is shown as a flag, not dressed up as a measurement.",
  },
  {
    title: "Data stays where it is",
    text: "HARM reads and counts inside the partner's environment. It has no network access and never writes patient values into its report.",
  },
  {
    title: "Contacts with provenance",
    text: "Only details published for the purpose of being contacted — never guessed addresses, scraped profiles or bought lists. Opt-outs are honoured everywhere.",
  },
];

const faqs = [
  {
    q: "Are these self-service software products?",
    a: "They are capabilities BCONZ operates with clients and data partners as part of a research collaboration. Contact us to arrange a demonstration or a pilot.",
  },
  {
    q: "Does HARM send our data to BCONZ?",
    a: "No. HARM runs on your own systems, blocks network use, and writes only aggregate counts to a report that you review before choosing whether to share it.",
  },
  {
    q: "What are the main real-world data sources?",
    a: "Real-world data comes from electronic health records, claims and billing data, disease registries, laboratory and genomic results, imaging, and patient-reported or device data. BCONZ works with partners holding these sources under governed, institution-led agreements.",
  },
  {
    q: "Where does DIA's demand evidence come from?",
    a: "Public sources only: published limitations in research papers, active grants from NIH, the European Commission and UKRI, and live trials in ClinicalTrials.gov, the EU Clinical Trials Information System and ISRCTN.",
  },
  {
    q: "How are contacts handled?",
    a: "DIA's contact layer only records details that were published so people could be contacted — such as a paper's corresponding author or a trial's listed study contact — together with the source and the lawful basis for using it.",
  },
];

export { faqs as platformFaqs };

export function PlatformPage() {
  return (
    <main>
      <Section className="bg-slate-50">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">The BCONZ platform</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                A real-world data platform built on evidence
              </h1>
              <p className="text-lg leading-8 text-slate-700">
                Many real-world data companies sell access to a fixed database. BCONZ connects research demand with
                governed healthcare data from hospital, laboratory and research partners — and uses three capabilities to
                make every step evidence-led.
              </p>
              <p className="text-base leading-7 text-slate-700">
                <Link href="/platform/harm" className="font-semibold text-slate-950 underline underline-offset-4">HARM</Link> is a
                data readiness assessment that shows what a dataset can support.{" "}
                <Link href="/platform/pia" className="font-semibold text-slate-950 underline underline-offset-4">PIA</Link> brings
                evidence to clinical trial site selection and data partner identification.{" "}
                <Link href="/platform/dia" className="font-semibold text-slate-950 underline underline-offset-4">DIA</Link> finds
                the organisations whose published papers, grants and trials say they need data like yours.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="primary" size="large" as="a" href="/contact">
                  Request a demonstration
                </Button>
                <Button variant="secondary" size="large" as="a" href="#products">
                  Explore the platform
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {products.map((p) => (
                <a key={p.slug} href={`/platform/${p.slug}`}
                   className="flex items-start gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-white">
                    <Icon name={p.icon} className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{p.name} <span className="font-normal text-slate-500">· {p.full}</span></p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{p.audience}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>How it fits together</Label>
            <Heading>From a real-world dataset to the research that needs it</Heading>
            <Subheading>
              Each capability answers one question in the partnership. Together they replace guesswork with evidence at every step.
            </Subheading>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {flow.map((f, i) => (
              <li key={f.step} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">{i + 1}</span>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">{f.product}</p>
                </div>
                <p className="mt-4 text-xl font-semibold text-slate-950">{f.step}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{f.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="bg-slate-50" >
        <Container>
          <div id="products" className="mx-auto max-w-4xl scroll-mt-28 space-y-6 text-center">
            <Label>Capabilities</Label>
            <Heading>Data readiness, site selection and demand intelligence</Heading>
          </div>
          <div className="mt-12 space-y-10">
            {products.map((p, index) => (
              <article key={p.slug} id={p.slug}
                       className={`grid scroll-mt-28 gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[1.05fr_0.95fr] ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                      <Icon name={p.icon} className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{p.name}</h2>
                      <p className="text-sm text-slate-600">{p.full}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">{p.audience}</p>
                  <p className="mt-5 text-base leading-7 text-slate-700">{p.intro[0]}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="primary" size="normal" as="a" href={`/platform/${p.slug}`}>Learn more about {p.name}</Button>
                    <Button variant="secondary" size="normal" as="a" href={p.cta.href}>{p.cta.label}</Button>
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                  <div className="grid gap-5 rounded-[1.75rem] bg-slate-50 p-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">What it does</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
                        {p.capabilities.map((c) => <li key={c}>{c}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">What you get</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.outputs.map((o) => (
                          <span key={o} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">{o}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Principles</Label>
            <Heading>Built to be trusted by the people whose data it concerns</Heading>
            <Subheading>
              The same rules run through all three capabilities, in line with our{" "}
              <Link href="/responsible-data-governance" className="font-semibold text-slate-950 underline underline-offset-4">responsible data</Link>{" "}
              and{" "}
              <Link href="/responsible-ai-principles" className="font-semibold text-slate-950 underline underline-offset-4">responsible AI</Link>{" "}
              principles.
            </Subheading>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <Card key={p.title} className="p-6">
                <p className="text-lg font-semibold text-slate-950">{p.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{p.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Frequently asked questions</Label>
            <Heading>About the BCONZ platform</Heading>
          </div>
          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <summary className="cursor-pointer text-base font-semibold text-slate-950 outline-none">{f.q}</summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-slate-950 p-10 text-center text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">See it on your own question</p>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-200">
              Bring a dataset, a disease area or a research requirement. We will show you the evidence the platform finds.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Button variant="secondary" size="large" as="a" href="/contact">Request a demonstration</Button>
              <Button variant="secondary" size="large" as="a" href="/data-partners">For data partners</Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
