import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: "https://publishstudio.one",
    sitemap: "https://publishstudio.one/sitemap.xml",
  };
}
