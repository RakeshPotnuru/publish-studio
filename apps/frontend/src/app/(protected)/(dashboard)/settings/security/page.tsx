import type { Metadata } from "next";

import { Security } from "@/components/modules/dashboard/settings/security";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.settings.security.title,
  description: siteConfig.pages.settings.security.description,
};

export default function SecurityPage() {
  return <Security />;
}
