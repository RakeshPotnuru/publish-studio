import type { Metadata } from "next";
import Script from "next/script";

import { Footer } from "@/components/ui/layouts/footer";
import { siteConfig } from "@/config/site";

declare global {
    interface Window {
        google: any;
    }
}

export const metadata: Metadata = {
    title: { template: `%s | ${siteConfig.title}`, default: "Authentication" },
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <main className="bg-pattern-light dark:bg-pattern-dark min-h-dvh">
                <div className="container flex flex-col items-center justify-center pb-8 pt-28">
                    <div className="bg-background dark:bg-background-dark container mx-auto flex w-full flex-col justify-center space-y-6 rounded-lg p-14 shadow-xl sm:w-[500px]">
                        {children}
                    </div>
                </div>
                <Footer className="bg-background mx-auto max-w-max justify-center rounded-lg p-2 py-1 shadow-md" />
            </main>
            <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
        </>
    );
}
