import { JsonLd } from "@/components/seo/JsonLd";
import { ProductPage } from "@/components/platform/ProductPage";
import { productBySlug } from "@/content/platform";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const path = "/platform/pia" as const;
const product = productBySlug("pia");

export const metadata = createMetadata(getPageSeo(path));

export default function Page() {
  return (
    <>
      <JsonLd id="ld-pia-page" data={webPageJsonLd(path)} />
      <JsonLd id="ld-pia-breadcrumb" data={breadcrumbJsonLd([
        { name: "Home", path: "/" }, { name: "Platform", path: "/platform" }, { name: product.name, path }])} />
      <JsonLd id="ld-pia-service" data={serviceJsonLd(path, `${product.name} — ${product.full}`,
        "Clinical trial site selection and data partner identification", "Pharmaceutical, biotechnology, CRO and research teams")} />
      <JsonLd id="ld-pia-faq" data={faqJsonLd(product.faqs)} />
      <ProductPage product={product} />
    </>
  );
}
