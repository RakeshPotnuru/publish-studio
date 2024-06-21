import type { Metadata } from "next";

import { Connections } from "@/components/modules/dashboard/settings/connections";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.settings.connections.title,
  description: siteConfig.pages.settings.connections.description,
};

export default function ConnectionsPage() {
  return <Connections />;
}
