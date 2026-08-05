import type { Metadata } from "next";
import { metadataBase, siteDescription, siteName } from "@/lib/site";

export function createMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase,
    title: overrides.title ?? siteName,
    description: overrides.description ?? siteDescription,
    openGraph: {
      title: overrides.title ?? siteName,
      description: overrides.description ?? siteDescription,
      url: metadataBase.toString(),
      siteName,
      type: "website",
      images: [
        {
          url: `${metadataBase.toString()}favicon.svg`,
          width: 1200,
          height: 630,
          alt: "BCONZ website",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: overrides.title ?? siteName,
      description: overrides.description ?? siteDescription,
    },
    ...overrides,
  };
}
