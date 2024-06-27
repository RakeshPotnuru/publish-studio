import type { Metadata } from "next";

import { Projects } from "@/components/modules/dashboard/projects";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.projects.title,
  description: siteConfig.pages.projects.description,
};

export default function ProjectsPage() {
  return <Projects />;
}
