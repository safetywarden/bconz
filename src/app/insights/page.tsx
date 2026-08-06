import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/metadata";
import { InsightsPage } from "@/components/insights/InsightsPage";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/structured-data";

const seo = getPageSeo("/insights");

export const metadata = createMetadata(seo);

export default function InsightsRoute() {
  return (
    <>
      <JsonLd id="ld-insights-page" data={webPageJsonLd("/insights")} />
      <JsonLd id="ld-insights-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }])} />
      <InsightsPage />
    </>
  );
}
