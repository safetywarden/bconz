import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} - Healthcare Data Partnerships`,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#020617",
    lang: "en",
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
