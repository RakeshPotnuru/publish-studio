import type { Metadata } from "next";

import { Navbar } from "@/components/ui/navbar";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: { template: `%s | ${siteConfig.title}`, default: "Dashboard" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="m-8">{children}</main>
        </>
    );
}
