import type { Metadata } from "next";

import { VerifyEmail } from "@/components/modules/auth/verify-email";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.verifyEmail.title,
  description: siteConfig.pages.verifyEmail.description,
};

export default function VerifyEmailPage() {
  return <VerifyEmail />;
}
