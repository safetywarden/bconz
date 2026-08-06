import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Label, Subheading } from "@/components/ui/typography";
import { RequestDataForm } from "@/components/contact/RequestDataForm";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

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
                Use this form if you represent a pharmaceutical, biotechnology, CRO, healthcare AI or research team seeking research-ready healthcare data for scientific work.
              </Subheading>
              <div className="mt-6 space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-sm leading-7 text-slate-700">
                <p>
                  Include your research objective, disease area, target cohort, relevant data modalities and preferred collaboration timeline. Do not include patient-identifiable information in this form.
                </p>
                <p>
                  After submission, BCONZ will review the research fit and contact you using the details provided. You can also review our <Link href="/data" className="font-semibold text-slate-950 underline underline-offset-4">research data capabilities</Link>, <Link href="/solutions" className="font-semibold text-slate-950 underline underline-offset-4">solution pathways</Link> and <Link href="/privacy" className="font-semibold text-slate-950 underline underline-offset-4">privacy commitments</Link> before submitting.
                </p>
              </div>
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
