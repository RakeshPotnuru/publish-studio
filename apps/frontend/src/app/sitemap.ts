import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_CLIENT_URL ?? "https://app.publishstudio.one"}/login`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_CLIENT_URL ?? "https://app.publishstudio.one"}/register`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 1,
    },
  ];
}
