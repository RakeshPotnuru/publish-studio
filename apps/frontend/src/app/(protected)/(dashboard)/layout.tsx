import type { Metadata } from "next";

import { Sidebar } from "@/components/common/layout/sidebar";
import { Shell } from "@/components/ui/shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { template: `%s | ${siteConfig.title}`, default: "Dashboard" },
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[85dvh] flex-row space-x-8">
      <Sidebar className="w-1/5" />
      <Shell className="w-full">{children}</Shell>
    </div>
  );
}
