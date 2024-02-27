import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: "PS",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#EB5757",
    icons: [
      {
        sizes: "any",
        src: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        sizes: "36x36",
        src: "/android-icon-36x36.png",
        type: "image/png",
      },
      {
        sizes: "48x48",
        src: "/android-icon-48x48.png",
        type: "image/png",
      },
      {
        sizes: "72x72",
        src: "/android-icon-72x72.png",
        type: "image/png",
      },
      {
        sizes: "96x96",
        src: "/android-icon-96x96.png",
        type: "image/png",
      },
      {
        sizes: "144x144",
        src: "/android-icon-144x144.png",
        type: "image/png",
      },
      {
        sizes: "192x192",
        src: "/android-icon-192x192.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/android-icon-512x512.png",
        type: "image/png",
      },
      {
        sizes: "192x192",
        src: "/maskable-icon-192x192.png",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
