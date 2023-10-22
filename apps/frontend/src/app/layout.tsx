import "@/styles/globals.css";

import type { Metadata } from "next";

import { ThemeToggleButton } from "@/components/dev-tools/theme-toggle";
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
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
                <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
                <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
                <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
                <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="192x192"
                    href="/android-icon-192x192.png"
                />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
                <meta name="theme-color" content="#ffffff" />
            </head>
            <body className="min-h-screen bg-slate-200 dark:bg-slate-700">
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
