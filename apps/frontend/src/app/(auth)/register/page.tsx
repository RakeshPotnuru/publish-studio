import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.pages.register.title,
  description: siteConfig.pages.register.description,
};

export default function RegisterPage() {
  // return <RegisterForm />;
  return (
    <h1 className="text-center text-2xl font-bold">
      Sign up is disabled. A new Publish Studio experience is coming soon.
    </h1>
  );
}
