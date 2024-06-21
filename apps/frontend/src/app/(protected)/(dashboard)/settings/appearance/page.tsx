import type { Metadata } from "next";

import { Appearance } from "@/components/modules/dashboard/settings/appearance";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.settings.appearance.title,
  description: siteConfig.pages.settings.appearance.description,
};

export default function AppearancePage() {
  return <Appearance />;
}
