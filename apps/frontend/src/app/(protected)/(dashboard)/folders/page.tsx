import type { Metadata } from "next";

import { Folders } from "@/components/modules/dashboard/folders";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.folders.title,
  description: siteConfig.pages.folders.description,
};

export default function FoldersPage() {
  return <Folders />;
}
