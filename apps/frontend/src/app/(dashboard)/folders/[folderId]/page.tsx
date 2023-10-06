import type { Metadata } from "next";

import { DashboardShell } from "@/components/ui/shell";

export const metadata: Metadata = {
    title: "Folder Name",
};

export default function FolderPage() {
    return (
        <DashboardShell>
            <h1>Folder Name</h1>
        </DashboardShell>
    );
}
