import dynamic from "next/dynamic";
import Script from "next/script";

import type { Metadata, Viewport } from "next";

import "@/styles/globals.css";
import { BreakpointViewer } from "@/components/dev-tools/breakpoint-viewer";
import { ThemeToggleButton } from "@/components/dev-tools/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { Providers } from "@/lib/providers";

const PostHogPageView = dynamic(() => import("@/lib/posthog-page-view"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.title}`,
    default: siteConfig.title,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitter.creator,
    site: siteConfig.twitter.site,
  },
  appLinks: {
    web: {
      url: siteConfig.url,
    },
  },
  category: "Software",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.theme.color,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta name="msapplication-TileColor" content="#EB5757" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      </head>
      <body className="min-h-dvh bg-slate-200 antialiased dark:bg-stone-900">
        {(process.env.NODE_ENV === "test" ||
          process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") && (
          <div className="flex justify-center bg-destructive py-[1px]">
            <p className="text-xs text-destructive-foreground">
              ⚠️ This is a staging environment. Data won&apos;t be retained.
            </p>
          </div>
        )}
        <Providers>
          <PostHogPageView />
          {children}
          <Toaster />
          {process.env.NODE_ENV === "development" && (
            <>
              <BreakpointViewer />
              <ThemeToggleButton />
            </>
          )}
        </Providers>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
