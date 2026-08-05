import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Label, Subheading } from "@/components/ui/typography";
import { RequestDataForm } from "@/components/contact/RequestDataForm";

export const metadata = createMetadata({
  title: "Request Research Data | BCONZ",
  description: "Request research data and start a conversation with BCONZ about collaboration opportunities.",
});

export default function RequestDataRoute() {
  return (
    <PageShell title="Request Research Data" description="Tell us about your research objectives and we&apos;ll discuss potential collaboration opportunities.">
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <Label>Request Research Data</Label>
            <Heading>Request Research Data</Heading>
            <Subheading>
                Tell us about your research objectives and we&apos;ll discuss potential collaboration opportunities.
            </Subheading>
            <div className="mt-8">
              <RequestDataForm />
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
