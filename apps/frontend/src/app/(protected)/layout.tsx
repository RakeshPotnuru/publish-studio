"use client";

import { redirect } from "next/navigation";

import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import { Navbar } from "@/components/ui/layouts/navbar";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { data, isLoading, error } = trpc.getMe.useQuery();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (error || data?.status !== "success") {
        redirect(siteConfig.pages.login.link);
    }

    return (
        <>
            <Navbar />
            <main className="m-8">{children}</main>
        </>
    );
}
