import type { Metadata } from "next";

import Snippets from "@/components/modules/dashboard/snippets";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.snippets.title,
  description: siteConfig.pages.snippets.description,
};

export default function SnippetsPage() {
  return <Snippets />;
}
