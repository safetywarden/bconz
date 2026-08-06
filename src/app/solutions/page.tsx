import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { SolutionsPage } from "@/components/solutions/SolutionsPage";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const seo = getPageSeo("/solutions");

export const metadata = createMetadata(seo);

export default function Page() {
  return (
    <>
      <JsonLd id="ld-solutions-page" data={webPageJsonLd("/solutions")} />
      <JsonLd id="ld-solutions-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }])} />
      <SolutionsPage />
    </>
  );
}
