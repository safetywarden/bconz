import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { DataPartnersPage } from "@/components/data-partners/DataPartnersPage";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

const seo = getPageSeo("/data-partners");

export const metadata = createMetadata(seo);

export default function Page() {
  return (
    <>
      <JsonLd id="ld-data-partners-page" data={webPageJsonLd("/data-partners")} />
      <JsonLd id="ld-data-partners-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Data Partners", path: "/data-partners" }])} />
      <DataPartnersPage />
    </>
  );
}
