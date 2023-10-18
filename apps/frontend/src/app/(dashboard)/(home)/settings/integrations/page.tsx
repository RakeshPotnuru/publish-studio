import type { Metadata } from "next";

import { Integrations } from "@/components/modules/dashboard/settings/integrations";

export const metadata: Metadata = {
    title: "Integrations",
    description: "Configure your integrations",
};

export default function IntegrationsPage() {
    return <Integrations />;
}
