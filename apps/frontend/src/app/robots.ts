import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: "https://app.publishstudio.one",
    sitemap: "https://app.publishstudio.one/sitemap.xml",
  };
}
