import type { Metadata } from "next";

import { Profile } from "@/components/modules/dashboard/profile";
import { DashboardShell } from "@/components/ui/shell";

export const metadata: Metadata = {
    title: "Profile",
};

export default function ProfilePage() {
    return (
        <DashboardShell>
            <Profile />
        </DashboardShell>
    );
}
