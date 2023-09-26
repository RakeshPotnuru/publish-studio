import "@/styles/globals.css";

import type { Metadata } from "next";

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
        <html lang="en" suppressHydrationWarning>
            <body className="dark:text-foreground-dark min-h-screen bg-slate-100">{children}</body>
        </html>
    );
}
