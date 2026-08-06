import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Label, Subheading } from "@/components/ui/typography";
import { RequestDataForm } from "@/components/contact/RequestDataForm";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

const seo = getPageSeo("/request-data");

export const metadata = createMetadata(seo);

export default function RequestDataRoute() {
  return (
    <>
      <JsonLd id="ld-request-data-page" data={webPageJsonLd("/request-data")} />
      <JsonLd id="ld-request-data-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Request Data", path: "/request-data" }])} />
      <PageShell title="Request Research Data" description="Tell us about your research objectives and we&apos;ll discuss potential collaboration opportunities.">
        <Section>
          <Container>
            <div className="mx-auto max-w-4xl">
              <Label>Request Research Data</Label>
              <Heading>Request clinical, molecular and real-world healthcare data</Heading>
              <Subheading>
                Share your study objective, disease area and data modalities so BCONZ can review research fit and collaboration next steps.
              </Subheading>
              <div className="mt-8">
                <RequestDataForm />
              </div>
            </div>
          </Container>
        </Section>
      </PageShell>
    </>
  );
}
