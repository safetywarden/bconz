import { JsonLd } from "@/components/seo/JsonLd";
import { ProductPage } from "@/components/platform/ProductPage";
import { productBySlug } from "@/content/platform";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const path = "/platform/harm" as const;
const product = productBySlug("harm");

export const metadata = createMetadata(getPageSeo(path));

export default function Page() {
  return (
    <>
      <JsonLd id="ld-harm-page" data={webPageJsonLd(path)} />
      <JsonLd id="ld-harm-breadcrumb" data={breadcrumbJsonLd([
        { name: "Home", path: "/" }, { name: "Platform", path: "/platform" }, { name: product.name, path }])} />
      <JsonLd id="ld-harm-service" data={serviceJsonLd(path, `${product.name} — ${product.full}`,
        "Healthcare data readiness assessment", "Hospitals, laboratories and healthcare data partners")} />
      <JsonLd id="ld-harm-faq" data={faqJsonLd(product.faqs)} />
      <ProductPage product={product} />
    </>
  );
}
