import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
      allow: ["/login", "/register", "/sitemap.xml"],
    },
    host: "https://app.publishstudio.one",
    sitemap: "https://app.publishstudio.one/sitemap.xml",
  };
}
