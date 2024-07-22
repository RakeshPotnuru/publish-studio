import type { Metadata } from "next";

import { Navbar } from "@/components/common/layout/navbar";
import { MobileNotice } from "@/components/ui/mobile-notice";
import { NetworkStatusToast } from "@/components/ui/network-status-toast";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { template: `%s | ${siteConfig.title}`, default: "Dashboard" },
  description: siteConfig.description,
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MobileNotice>
      <Navbar />
      <main>{children}</main>
      <NetworkStatusToast />
    </MobileNotice>
  );
}
