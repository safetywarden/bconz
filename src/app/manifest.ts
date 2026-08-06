import type { MetadataRoute } from "next";
import { seoSiteConfig } from "@/lib/seo/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${seoSiteConfig.siteName} - Healthcare Data Partnerships`,
    short_name: seoSiteConfig.siteName,
    description: seoSiteConfig.defaultDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#020617",
    lang: seoSiteConfig.language,
    categories: ["business", "health", "productivity"],
    icons: [
      {
        src: "/Images/brand/bconz-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Images/brand/bconz-favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
