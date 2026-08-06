import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/hero/hero";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const seo = getPageSeo("/");

export const metadata = createMetadata(seo);

export default function Home() {
  return (
    <>
      <JsonLd id="ld-home-page" data={webPageJsonLd("/")} />
      <JsonLd id="ld-home-breadcrumb" data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <main>
        <Hero />
      </main>
    </>
  );
}
