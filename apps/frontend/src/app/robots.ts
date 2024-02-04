import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
      allow: ["/login", "/register"],
    },
    sitemap: "https://publishstudio.one/sitemap.xml",
  };
}
