import { Button } from "@/components/ui/button";
import { Heading, Label, Subheading } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactOptionCard } from "@/components/contact/ContactOptionCard";
import type { IconName } from "@/components/ui/icon";
import { OfficeCard } from "@/components/contact/OfficeCard";
import { ContactForm } from "@/components/contact/ContactForm";

const contactOptions: { title: string; description: string; actionLabel?: string; actionHref?: string; icon: IconName }[] = [
  {
    title: "Research Data",
    description: "Discuss disease areas, cohort criteria, data modalities and research objectives.",
    actionLabel: "Request Research Data",
    actionHref: "/request-data",
    icon: "research",
  },
  {
    title: "Healthcare Data Partnerships",
    description: "Explore collaboration opportunities for hospitals, laboratories, biobanks and research institutions.",
    actionLabel: "Become a Data Partner",
    actionHref: "/data-partners",
    icon: "partnership",
  },
  {
    title: "General & Strategic Enquiries",
    description: "Strategic partnerships, events, media, technology or corporate matters.",
    actionLabel: "Start an Enquiry",
    actionHref: "/contact#contact-form",
    icon: "trust",
  },
];

export function ContactPage() {
  return (
    <main>
      {/* Compact hero */}
      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center py-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Contact BCONZ</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Let&apos;s Discuss Your Research or Partnership Goals</h1>
            <p className="mt-4 text-lg leading-7 text-slate-700">
              Whether you represent a healthcare organization, pharmaceutical company, biotechnology company, research institution or
              healthcare AI team, BCONZ would welcome the opportunity to understand your priorities and explore a potential collaboration.
            </p>
            <div className="mt-6">
              <Button as="a" href="#contact-form" variant="primary" size="large">
                Start Your Enquiry
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Enquiry pathways */}
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>How Can We Help?</Label>
            <Heading>Enquiry pathways</Heading>
            <Subheading>Choose the option that best matches your needs to speed up our response.</Subheading>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {contactOptions.map((opt) => (
              <ContactOptionCard key={opt.title} {...opt} large />
            ))}
          </div>
        </Container>
      </Section>

      {/* General contact form */}
      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-5xl space-y-6 text-center">
            <Label>Send Us a Message</Label>
            <Heading>Share a few details and we&apos;ll review your enquiry</Heading>
            <Subheading>Provide basic details below and the appropriate BCONZ team member will review your enquiry.</Subheading>
          </div>
          <div id="contact-form" className="mt-8 w-full">
            <ContactForm />
          </div>
        </Container>
      </Section>

      {/* Global presence */}
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Our Offices</Label>
            <Heading>Global Presence</Heading>
            <Subheading>BCONZ operates across regions — contact the office nearest you.</Subheading>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <OfficeCard
              title="India Headquarters"
              lines={[
                "Bconz International (OPC) Pvt Ltd",
                "Manipal County Road",
                "Bangalore – 560068",
                "India",
              ]}
              phone="+91 7624841555"
              actionHref="#contact-form"
            />
            <OfficeCard
              title="Singapore Office"
              lines={[
                "BCONZ INTERNATIONAL PTE. LTD.",
                "60 Paya Lebar Road",
                "#06-53 Paya Lebar Square",
                "Singapore 409051",
              ]}
              phone=""
              actionHref="#contact-form"
            />
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center py-12">
            <Label>Looking for Research Data or Representing a Healthcare Institution?</Label>
            <Heading>Request Research Data or Become a Data Partner</Heading>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button as="a" href="/request-data" variant="primary" size="large">
                Request Research Data
              </Button>
              <Button as="a" href="/data-partners" variant="secondary" size="large">
                Become a Data Partner
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
