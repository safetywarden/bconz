import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { DataPartnersPage, dataPartnerFaqs } from "@/components/data-partners/DataPartnersPage";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const seo = getPageSeo("/data-partners");

export const metadata = createMetadata(seo);

export default function Page() {
  return (
    <>
      <JsonLd id="ld-data-partners-page" data={webPageJsonLd("/data-partners")} />
      <JsonLd id="ld-data-partners-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Data Partners", path: "/data-partners" }])} />
      <JsonLd id="ld-data-partners-faq" data={faqJsonLd(dataPartnerFaqs.map((f) => ({ q: f.question, a: f.answer })))} />
      <DataPartnersPage />
    </>
  );
}
