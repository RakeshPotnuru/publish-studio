import type { Metadata } from "next";

import { Assets } from "@/components/modules/dashboard/assets";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.assets.title,
  description: siteConfig.pages.assets.description,
};

export default function AssetsPage() {
  return <Assets />;
}
