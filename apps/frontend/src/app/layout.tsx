import "@/styles/globals.css";

import type { Metadata } from "next";

import { ThemeToggleButton } from "@/components/ui/dev-theme-toggle";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: {
        template: `%s | ${siteConfig.title}`,
        default: siteConfig.title,
    },
    description: siteConfig.description,
    openGraph: {
        title: siteConfig.title,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.title,
        type: "website",
        locale: "en_US",
    },
    robots: {
        follow: false,
        index: false,
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
    themeColor: siteConfig.theme?.color,
    manifest: "/manifest.json",
    viewport: {
        width: "device-width",
        initialScale: 1,
    },
    appLinks: {
        web: {
            url: siteConfig.url,
        },
    },
    category: "Software",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-slate-100 dark:bg-slate-700">
                {/* <LogRocketProvider /> */}
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    {env.NODE_ENV === "development" && <ThemeToggleButton />}
                </ThemeProvider>
            </body>
        </html>
    );
}
