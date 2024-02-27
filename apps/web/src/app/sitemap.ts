import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 1,
    },
    {
      url: siteConfig.pages.privacyPolicy.link,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
    {
      url: siteConfig.pages.termsOfService.link,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
  ];
}
