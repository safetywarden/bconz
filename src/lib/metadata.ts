import type { Metadata } from "next";
import { metadataBase } from "@/lib/site";
import { absoluteUrl, defaultOgImage, type PublicRoute } from "@/lib/seo";
import { seoSiteConfig } from "@/lib/seo/site-config";

type CreateMetadataOptions = Partial<Metadata> & {
  path?: PublicRoute;
  keywords?: string[];
};

export function createMetadata(overrides: CreateMetadataOptions = {}): Metadata {
  const path = overrides.path ?? "/";
  const canonicalUrl = absoluteUrl(path);
  const titleText = typeof overrides.title === "string" ? overrides.title : seoSiteConfig.defaultTitle;
  const description =
    typeof overrides.description === "string" ? overrides.description : seoSiteConfig.defaultDescription;
  const ogImage = absoluteUrl(defaultOgImage);

  return {
    metadataBase,
    title: overrides.title
      ? overrides.title
      : {
          default: seoSiteConfig.defaultTitle,
          template: seoSiteConfig.titleTemplate,
        },
    description,
    keywords: overrides.keywords,
    manifest: "/manifest.webmanifest",
    applicationName: seoSiteConfig.siteName,
    creator: seoSiteConfig.siteName,
    publisher: seoSiteConfig.siteName,
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
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
      title: titleText,
      description,
      url: canonicalUrl,
      siteName: seoSiteConfig.siteName,
      type: "website",
      locale: seoSiteConfig.locale,
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
      title: titleText,
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
