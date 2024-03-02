import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteConfig.url;

  return [
    {
      url,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 1,
    },
    {
      url: `${url}${siteConfig.pages.privacyPolicy.link}`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
    {
      url: `${url}${siteConfig.pages.termsOfService.link}`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
  ];
}
