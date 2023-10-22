import { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: { template: `%s - Settings | ${siteConfig.title}`, default: "Settings" },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
