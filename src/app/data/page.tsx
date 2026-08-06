import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { ResearchDataPage } from "@/components/data/ResearchDataPage";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

const seo = getPageSeo("/data");

export const metadata = createMetadata(seo);

export default function DataPage() {
  return (
    <>
      <JsonLd id="ld-data-page" data={webPageJsonLd("/data")} />
      <JsonLd id="ld-data-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Research Data", path: "/data" }])} />
      <ResearchDataPage />
    </>
  );
}
