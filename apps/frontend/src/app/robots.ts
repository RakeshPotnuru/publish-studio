import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            disallow: "/",
        },
        sitemap: "https://publishstudio.one/sitemap.xml",
    };
}
