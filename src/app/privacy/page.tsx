import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/layout/page-shell";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const seo = getPageSeo("/privacy");

export const metadata = createMetadata(seo);

export default function PrivacyPage() {
  return (
    <>
      <JsonLd id="ld-privacy-page" data={webPageJsonLd("/privacy")} />
      <JsonLd id="ld-privacy-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" }])} />
      <PageShell title="Privacy" description="BCONZ privacy commitments for trusted healthcare data partnerships.">
        <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Privacy</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Protecting data through governance and compliance</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We design our data partnerships with strict privacy controls, access oversight, and regulatory safeguards for healthcare research and analytics.
            </p>
          </div>
        </div>
      </PageShell>
    </>
  );
}
