import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/modules/auth/reset-password-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.resetPassword.title,
  description: siteConfig.pages.resetPassword.description,
};

export default function ResetPage() {
  return <ResetPasswordForm />;
}
