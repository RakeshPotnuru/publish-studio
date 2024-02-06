import type { Metadata } from "next";

import { Assets } from "@/components/modules/dashboard/assets";

export const metadata: Metadata = {
  title: "Assets",
  description: "Find your assets",
};

export default function AssetsPage() {
  return <Assets />;
}
