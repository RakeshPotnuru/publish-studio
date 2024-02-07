import type { Metadata } from "next";

import { Security } from "@/components/modules/dashboard/settings/security";

export const metadata: Metadata = {
  title: "Security",
  description: "Manage your account security settings",
};

export default function SecurityPage() {
  return <Security />;
}
