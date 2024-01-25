import type { Metadata } from "next";

import { Connections } from "@/components/modules/dashboard/settings/connections";

export const metadata: Metadata = {
    title: "Connections",
    description: "Configure your connections",
};

export default function ConnectionsPage() {
    return <Connections />;
}
