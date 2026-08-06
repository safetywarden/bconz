import type { Metadata } from "next";
import { metadataBase, siteDescription, siteName } from "@/lib/site";
import { absoluteUrl, defaultOgImage, type PublicRoute } from "@/lib/seo";

type CreateMetadataOptions = Partial<Metadata> & {
  path?: PublicRoute;
  keywords?: string[];
};

export function createMetadata(overrides: CreateMetadataOptions = {}): Metadata {
  const path = overrides.path ?? "/";
  const canonicalUrl = absoluteUrl(path);
  const title = overrides.title ?? siteName;
  const description = overrides.description ?? siteDescription;
  const ogImage = absoluteUrl(defaultOgImage);

  return {
    metadataBase,
    title,
    description,
    keywords: overrides.keywords,
    manifest: "/manifest.webmanifest",
    applicationName: siteName,
    authors: [{ name: siteName, url: metadataBase.toString() }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "BCONZ healthcare data partnerships",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/Images/brand/bconz-icon.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/Images/brand/bconz-icon.png", sizes: "180x180", type: "image/png" }],
    },
    category: "Healthcare data partnerships",
    ...overrides,
  };
}
