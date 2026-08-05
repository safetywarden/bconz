import { MetadataRoute } from "next";
import { metadataBase, navigation } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: metadataBase.toString(),
      lastModified: new Date(),
    },
    ...navigation.map((item) => ({
      url: new URL(item.href, metadataBase).toString(),
      lastModified: new Date(),
    })),
    { url: new URL("/privacy", metadataBase).toString(), lastModified: new Date() },
    { url: new URL("/terms", metadataBase).toString(), lastModified: new Date() },
  ];
}
