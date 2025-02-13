import type { Metadata } from "next";

import { RegisterForm } from "@/components/modules/auth/register-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.register.title,
  description: siteConfig.pages.register.description,
};

export default function RegisterPage() {
  return <RegisterForm />;
}
