import type { Metadata } from "next";

import { GoToHome } from "@/components/common/go-to-home";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    template: `%s - Settings | ${siteConfig.title}`,
    default: "Settings",
  },
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
