import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { Footer } from "@/components/ui/footer";

export const metadata: Metadata = {
    title: { template: `%s | ${siteConfig.title}`, default: "Authentication" },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="bg-pattern-light dark:bg-pattern-dark min-h-screen">
            {children}
            <Footer className="bg-background mx-auto max-w-max justify-center rounded-lg p-2 py-1 shadow-md" />
        </main>
    );
}
