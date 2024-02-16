import Script from "next/script";

import type { Metadata } from "next";

import { Footer } from "@/components/common/layouts/footer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { template: `%s | ${siteConfig.title}`, default: "Authentication" },
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className="min-h-dvh bg-pattern-light dark:bg-pattern-dark">
        <div className="container flex flex-col items-center justify-center pb-8 pt-28">
          <div className="container mx-auto flex w-full flex-col justify-center space-y-6 rounded-lg bg-background p-14 shadow-xl sm:w-[500px]">
            {children}
          </div>
          <Footer className="mx-auto mt-8 max-w-max justify-center rounded-lg bg-background p-2 py-1 shadow-md" />
        </div>
      </main>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="beforeInteractive"
      />
    </>
  );
}
