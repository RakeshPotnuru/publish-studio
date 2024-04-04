import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/login`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/register`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 1,
    },
  ];
}
