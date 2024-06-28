import type { Metadata } from "next";

import { LoginForm } from "@/components/modules/auth/login-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.login.title,
  description: siteConfig.pages.login.description,
};

export default function LoginPage() {
  return <LoginForm />;
}
