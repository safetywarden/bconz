import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading, Label, Subheading } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const values = [
  "Scientific Integrity",
  "Collaboration",
  "Transparency",
  "Privacy by Design",
  "Long-Term Partnerships",
  "Continuous Learning",
];

const whyChoose = [
  "Enterprise mindset",
  "Collaborative approach",
  "Healthcare expertise",
  "Research-first philosophy",
  "Responsible governance",
  "Scalable partnerships",
];

const ecosystemFlow = [
  "Hospitals",
  "Diagnostic Laboratories",
  "Genomics",
  "Biobanks",
  "Researchers",
  "Life Sciences",
  "Healthcare AI",
  "Scientific Discovery",
];

export function AboutPage() {
  return (
    <main>
      <Section className="bg-slate-50">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">About BCONZ</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Building Trusted Healthcare Data Partnerships for Scientific Discovery
              </h1>
              <p className="text-lg leading-8 text-slate-700">
                BCONZ brings together healthcare organizations, life sciences companies and researchers through responsible healthcare data partnerships that support scientific discovery and innovation.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="primary" size="large" as="a" href="/contact">
                  Talk to Our Team
                </Button>
                <Button variant="secondary" size="large" as="a" href="/data-partners">
                  Become a Data Partner
                </Button>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-6">
                <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
                  <p className="text-sm uppercase tracking-[0.24em] text-teal-300">Our perspective</p>
                  <p className="mt-4 text-base leading-7">
                    We help institutions steward healthcare data in ways that center governance, research purpose and long-term collaboration.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Scientific focus</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Support research programs with high-integrity healthcare data and a collaborative partnership approach.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Institutional trust</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Build partnerships that preserve institutional governance and patient privacy.
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
            <Label>Our Vision</Label>
            <Heading>A Future Where Better Data Enables Better Research</Heading>
            <Subheading>
              Better collaboration, better research, better patient outcomes and stronger healthcare ecosystems.
            </Subheading>
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Our Mission</Label>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <Card className="p-6">
                <p className="text-xl font-semibold text-slate-950">Trusted Partnerships</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Connecting healthcare organizations and researchers through long-term collaboration.
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-xl font-semibold text-slate-950">Research Readiness</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Helping transform complex healthcare information into research-ready assets.
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-xl font-semibold text-slate-950">Responsible Innovation</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Supporting scientific progress through thoughtful governance and responsible data practices.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>What We Believe</Label>
            <Heading>Values that guide every partnership</Heading>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <Card key={value} className="p-6">
                <p className="text-lg font-semibold text-slate-950">{value}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Our Ecosystem</Label>
            <Heading>Connected institutions and research partners</Heading>
          </div>
          <div className="mt-12 space-y-6">
            {ecosystemFlow.map((item, index) => (
              <div key={item} className="flex items-center gap-4">
                <div className="flex h-14 min-w-[4rem] items-center justify-center rounded-3xl bg-white text-slate-950 shadow-sm border border-slate-200">
                  <p className="text-sm font-semibold">{item}</p>
                </div>
                {index < ecosystemFlow.length - 1 ? (
                  <span className="text-2xl font-semibold text-slate-300">↓</span>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Why Organizations Choose BCONZ</Label>
            <Heading>Trusted partnership strengths</Heading>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item) => (
              <Card key={item} className="p-6">
                <p className="text-lg font-semibold text-slate-950">{item}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-teal-600">Our Commitment</p>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              Every partnership begins with listening, understanding institutional priorities and building relationships based on trust, transparency and scientific purpose.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-slate-950 p-10 text-center text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">Ready to Start a Conversation?</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Button variant="primary" size="large" as="a" href="/contact">
                Contact Us
              </Button>
              <Button variant="secondary" size="large" as="a" href="/data-partners">
                Become a Partner
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
