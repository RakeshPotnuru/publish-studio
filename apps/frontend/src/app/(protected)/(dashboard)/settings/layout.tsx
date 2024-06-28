import type { Metadata } from "next";

import { GoToHome } from "@/components/common/go-to-home";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    template: `%s - ${siteConfig.pages.settings.title} | ${siteConfig.title}`,
    default: siteConfig.pages.settings.title,
  },
  description: siteConfig.pages.settings.description,
};

export default function SettingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <GoToHome />
      {children}
    </>
  );
}
