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
    title: "General Enquiries",
    description: "Questions about BCONZ partnerships, research collaboration, or site engagement.",
    actionLabel: "Contact Us",
    actionHref: "/contact#contact-form",
    icon: "research",
  },
  {
    title: "Healthcare Partnerships",
    description: "Start a conversation about institution-led healthcare data partnerships.",
    actionLabel: "Request a Discussion",
    actionHref: "/contact#contact-form",
    icon: "partnership",
  },
  {
    title: "Research Projects",
    description: "Discuss research needs, project scope and collaboration opportunities.",
    actionLabel: "Request Research Data",
    actionHref: "/request-data",
    icon: "research",
  },
  {
    title: "Speaking & Events",
    description: "Invitations for talks, panels and workshops.",
    actionLabel: "Contact Our Team",
    actionHref: "/contact#contact-form",
    icon: "trust",
  },
  {
    title: "Media",
    description: "Press and media enquiries about BCONZ and our work.",
    actionLabel: "Contact Our Team",
    actionHref: "/contact#contact-form",
    icon: "trust",
  },
];

export function ContactPage() {
  return (
    <main>
      <Section className="bg-slate-50">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Contact</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Let&apos;s Start a Conversation</h1>
              <p className="text-lg leading-8 text-slate-700">
                Whether you represent a healthcare organization, pharmaceutical company, biotechnology company, research institute
                or healthcare AI company, we&apos;d be pleased to discuss how BCONZ can support your research initiatives.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button as="a" href="/request-data" variant="primary" size="large">
                  Request Research Data
                </Button>
                <Button as="a" href="/data-partners" variant="secondary" size="large">
                  Become a Data Partner
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-6">
                <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
                  <p className="text-sm uppercase tracking-[0.24em] text-teal-300">Get in touch</p>
                  <p className="mt-4 text-base leading-7">Start a conversation about research, partnerships or events.</p>
                </div>
                <div className="grid gap-4">
                  {contactOptions.map((item) => (
                    <ContactOptionCard key={item.title} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <Label>Contact Options</Label>
            <Heading>Professional inquiry support for every team</Heading>
            <Subheading>Select the area that best matches your partnership or research interest and send us a message.</Subheading>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contactOptions.map((opt) => (
              <ContactOptionCard key={opt.title} {...opt} large />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-5xl space-y-6 text-center">
            <Label>Global Presence</Label>
            <Heading>Our offices</Heading>
            <Subheading>BCONZ operates across regions — contact the office nearest you.</Subheading>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <OfficeCard
              title="India Headquarters"
              lines={[
                "Bconz International (OPC) Pvt Ltd",
                "Manipal County Road",
                "Bangalore – 560068",
                "India",
              ]}
              phone="+91 7624841555"
              actionHref="/contact#contact-form"
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
              actionHref="/contact#contact-form"
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6">
            <Label>Contact Form</Label>
            <Heading>Start a partnership conversation</Heading>
            <Subheading>
              Provide details about your organization and the best way to contact you. We&apos;ll respond promptly with next steps.
            </Subheading>
          </div>
            <div id="contact-form" className="mt-8">
            <ContactForm />
          </div>
        </Container>
      </Section>
    </main>
  );
}
