import type { Metadata } from "next";

import { Navbar } from "@/components/ui/navbar";

export const metadata: Metadata = {
    title: "Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="m-8">{children}</main>
        </>
    );
}
