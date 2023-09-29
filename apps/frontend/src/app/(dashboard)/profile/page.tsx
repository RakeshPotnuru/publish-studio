import { Profile } from "@/components/modules/dashboard/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile",
};

export default function ProfilePage() {
    return (
        <div>
            <Profile />
        </div>
    );
}
