import type { Metadata } from "next";

import { Profile } from "@/components/modules/dashboard/profile";
import { Shell } from "@/components/ui/layouts/shell";

export const metadata: Metadata = {
    title: "Profile",
};

export default function ProfilePage() {
    return (
        <Shell>
            <Profile />
        </Shell>
    );
}
