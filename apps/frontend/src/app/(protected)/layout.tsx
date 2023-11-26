"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/ui/layouts/navbar";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [token, setToken] = useState<string | null>(null);

    const { data, isFetching, error } = trpc.getMe.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        enabled: token !== null,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("ps_access_token");
            if (!token) {
                redirect(siteConfig.pages.login.link);
            }
            setToken(token);
        }
    }, []);

    if (!isFetching && !error && data?.status === "error") {
        redirect(siteConfig.pages.login.link);
    }

    return (
        <>
            <Navbar />
            <main className="m-8">{children}</main>
        </>
    );
}
