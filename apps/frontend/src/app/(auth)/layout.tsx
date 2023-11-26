"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { Footer } from "@/components/ui/layouts/footer";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    const { data, isFetching, error } = trpc.getMe.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        enabled: token !== null,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("ps_access_token"));
        }
    }, []);

    if (token && !isFetching && !error && data?.status === "success") {
        redirect(siteConfig.pages.dashboard.link);
    }

    return (
        <main className="bg-pattern-light dark:bg-pattern-dark min-h-screen">
            <div className="container flex flex-col items-center justify-center pb-8 pt-28">
                <div className="bg-background dark:bg-background-dark container mx-auto flex w-full flex-col justify-center space-y-6 rounded-lg p-14 shadow-xl sm:w-[500px]">
                    {children}
                </div>
            </div>
            <Footer className="bg-background mx-auto max-w-max justify-center rounded-lg p-2 py-1 shadow-md" />
        </main>
    );
}
