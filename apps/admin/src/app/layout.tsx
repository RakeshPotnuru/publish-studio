import type { Metadata } from "next";

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Publish Studio",
  description:
    "Publish Studio is an all-in-one platform to curate and publish content to different platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <meta name="robots" content="noindex" />
      </head>
      <body className="min-h-dvh bg-slate-200 dark:bg-slate-700">
        {(process.env.NODE_ENV === "test" ||
          process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") && (
          <div className="flex justify-center bg-destructive py-[1px]">
            <p className="text-xs text-destructive-foreground">
              ⚠️ This is a staging environment. Data won&apos;t be retained.
            </p>
          </div>
        )}
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
