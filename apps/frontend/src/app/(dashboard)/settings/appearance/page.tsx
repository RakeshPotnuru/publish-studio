import type { Metadata } from "next";

import { Appearance } from "@/components/modules/dashboard/settings/appearance";

export const metadata: Metadata = {
    title: "Appearance",
    description: "Configure your appearance settings",
};

export default function AppearancePage() {
    return <Appearance />;
}
