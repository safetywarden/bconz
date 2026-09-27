import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { ResearchDataPage } from "@/components/data/ResearchDataPage";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";
import { dataFaqs } from "@/components/data/ResearchDataPage";

const seo = getPageSeo("/data");

export const metadata = createMetadata(seo);

export default function DataPage() {
  return (
    <>
      <JsonLd id="ld-data-page" data={webPageJsonLd("/data")} />
      <JsonLd id="ld-data-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Research Data", path: "/data" }])} />
      <JsonLd id="ld-data-faq" data={faqJsonLd(dataFaqs.map((f) => ({ q: f.question, a: f.answer })))} />
      <ResearchDataPage />
    </>
  );
}
