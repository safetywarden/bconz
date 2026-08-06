import { MetadataRoute } from "next";
import { metadataBase } from "@/lib/site";
import { sitemapRoutes, type PublicRoute } from "@/lib/seo";

const sitemapConfig: Record<
  PublicRoute,
  {
    changeFrequency: "weekly" | "monthly" | "yearly";
    priority: number;
  }
> = {
  "/": { changeFrequency: "weekly", priority: 1 },
  "/data": { changeFrequency: "monthly", priority: 0.9 },
  "/request-data": { changeFrequency: "monthly", priority: 0.9 },
  "/data-partners": { changeFrequency: "monthly", priority: 0.9 },
  "/solutions": { changeFrequency: "monthly", priority: 0.8 },
  "/insights": { changeFrequency: "monthly", priority: 0.7 },
  "/about": { changeFrequency: "monthly", priority: 0.7 },
  "/contact": { changeFrequency: "monthly", priority: 0.7 },
  "/privacy": { changeFrequency: "yearly", priority: 0.3 },
  "/terms": { changeFrequency: "yearly", priority: 0.3 },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...sitemapRoutes.map((route) => {
      const config = sitemapConfig[route.path];

      return {
        url: new URL(route.path, metadataBase).toString(),
        lastModified,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      };
    }),
  ];
}
