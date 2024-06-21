import type { Metadata } from "next";

import { Planner } from "@/components/modules/dashboard/planner";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.planner.title,
  description: siteConfig.pages.planner.description,
};

export default function PlannerPage() {
  return <Planner />;
}
