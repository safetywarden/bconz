import { JsonLd } from "@/components/seo/JsonLd";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const seo = getPageSeo("/platform");

export const metadata = createMetadata(seo);

export default function Page() {
  return (
    <>
      <JsonLd id="ld-platform-page" data={webPageJsonLd("/platform")} />
      <JsonLd id="ld-platform-breadcrumb" data={breadcrumbJsonLd([
        { name: "Home", path: "/" }, { name: "Platform", path: "/platform" }])} />
      <PlatformPage />
    </>
  );
}
