import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { DatasetAreaPage } from "@/components/data/DatasetAreaPage";
import { areas, type AreaSlug } from "@/content/datasets";
import { createMetadata } from "@/lib/metadata";
import { getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";

type Params = { params: Promise<{ area: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return areas.map((a) => ({ area: a.slug }));
}

function find(slug: string) {
  return areas.find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: Params) {
  const { area } = await params;
  const a = find(area);
  return a ? createMetadata(getPageSeo(`/data/${a.slug as AreaSlug}`)) : {};
}

export default async function Page({ params }: Params) {
  const { area } = await params;
  const a = find(area);
  if (!a) notFound();
  const path = `/data/${a.slug}` as const;
  return (
    <>
      <JsonLd id={`ld-data-${a.slug}-page`} data={webPageJsonLd(path)} />
      <JsonLd id={`ld-data-${a.slug}-breadcrumb`} data={breadcrumbJsonLd([
        { name: "Home", path: "/" }, { name: "Research Data", path: "/data" }, { name: `${a.name} datasets`, path }])} />
      <JsonLd id={`ld-data-${a.slug}-dataset`} data={{
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: a.title,
        description: a.description,
        keywords: a.keywords,
        url: `https://www.bconz.com${path}`,
        isAccessibleForFree: false,
        creator: { "@id": "https://www.bconz.com/#organization" },
        spatialCoverage: "United States",
      }} />
      <JsonLd id={`ld-data-${a.slug}-faq`} data={faqJsonLd(a.faqs)} />
      <DatasetAreaPage area={a} />
    </>
  );
}
