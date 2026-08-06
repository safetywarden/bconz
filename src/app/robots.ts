import type { MetadataRoute } from "next";
import { metadataBase } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const host = metadataBase.toString().replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/", "/test/", "/contact-test/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", metadataBase).toString(),
    host,
  };
}
