import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticlePage } from "@/components/insights/ArticlePage";
import { postBySlug, posts, type PostSlug } from "@/content/posts";
import { createMetadata } from "@/lib/metadata";
import { absoluteUrl, getPageSeo } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) return {};
  const meta = createMetadata(getPageSeo(`/insights/${p.slug as PostSlug}`));
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: p.published } };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) notFound();
  const path = `/insights/${p.slug}` as const;
  return (
    <>
      <JsonLd id={`ld-insight-${p.slug}-breadcrumb`} data={breadcrumbJsonLd([
        { name: "Home", path: "/" }, { name: "Insights", path: "/insights" }, { name: p.title, path }])} />
      <JsonLd id={`ld-insight-${p.slug}-article`} data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        keywords: p.keywords,
        datePublished: p.published,
        dateModified: p.published,
        url: absoluteUrl(path),
        mainEntityOfPage: absoluteUrl(path),
        author: { "@id": absoluteUrl("/#organization") },
        publisher: { "@id": absoluteUrl("/#organization") },
        inLanguage: "en",
      }} />
      <ArticlePage post={p} />
    </>
  );
}
