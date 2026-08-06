import { MetadataRoute } from "next";
import { metadataBase } from "@/lib/site";
import { sitemapRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...sitemapRoutes.map((route) => ({
      url: new URL(route.path, metadataBase).toString(),
      lastModified: new Date(),
      changeFrequency: route.path === "/" ? "weekly" as const : "monthly" as const,
      priority: route.path === "/" ? 1 : route.path === "/contact" || route.path === "/request-data" ? 0.8 : 0.7,
    })),
  ];
}
