import { JsonLd } from "@/components/seo/JsonLd";
import { ProductPage } from "@/components/platform/ProductPage";
import { productBySlug } from "@/content/platform";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

const path = "/platform/dia" as const;
const product = productBySlug("dia");

export const metadata = createMetadata(getPageSeo(path));

export default function Page() {
  return (
    <>
      <JsonLd id="ld-dia-page" data={webPageJsonLd(path)} />
      <JsonLd id="ld-dia-breadcrumb" data={breadcrumbJsonLd([
        { name: "Home", path: "/" }, { name: "Platform", path: "/platform" }, { name: product.name, path }])} />
      <JsonLd id="ld-dia-service" data={serviceJsonLd(path, `${product.name} — ${product.full}`,
        "Healthcare data demand intelligence and monetization", "Hospitals, laboratories and healthcare data partners")} />
      <JsonLd id="ld-dia-faq" data={faqJsonLd(product.faqs)} />
      <ProductPage product={product} />
    </>
  );
}
