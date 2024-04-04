import type { Metadata } from "next";

import { GoToHome } from "@/components/common/go-to-home";
import { Profile } from "@/components/modules/dashboard/profile";
import { Shell } from "@/components/ui/shell";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <>
      <GoToHome />
      <Shell>
        <Profile />
      </Shell>
    </>
  );
}
