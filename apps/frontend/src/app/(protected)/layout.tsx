import type { Metadata } from "next";

import { Navbar } from "@/components/common/layout/navbar";
import { NetworkStatusToast } from "@/components/ui/network-status-toast";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { template: `%s | ${siteConfig.title}`, default: "Dashboard" },
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className="m-8">{children}</main>
      <NetworkStatusToast />
    </>
  );
}
