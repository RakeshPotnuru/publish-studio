import type { Metadata } from "next";

import { Shell } from "@/components/ui/layouts/shell";
import { Sidebar } from "@/components/ui/layouts/sidebar";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: { template: `%s | ${siteConfig.title}`, default: "Dashboard" },
};

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex min-h-[85vh] flex-row space-x-8">
            <Sidebar className="w-1/5" />
            <Shell className="w-full">{children}</Shell>
        </div>
    );
}
