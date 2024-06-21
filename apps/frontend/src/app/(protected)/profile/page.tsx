import type { Metadata } from "next";

import { GoToHome } from "@/components/common/go-to-home";
import { Profile } from "@/components/modules/dashboard/profile";
import { Shell } from "@/components/ui/shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.profile.title,
  description: siteConfig.pages.profile.description,
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
