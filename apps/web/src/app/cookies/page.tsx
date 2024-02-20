import type { Metadata } from "next";

import { Heading } from "@/components/ui/heading";
import { siteConfig } from "@/config/site";

import { Section } from "../privacy-policy/page";

export const metadata: Metadata = {
  title: siteConfig.pages.cookies.title,
  description: siteConfig.pages.cookies.description,
};

export default function CookiesPage() {
  return (
    <div className="space-y-8">
      <Section>
        <Heading>Cookie Policy</Heading>
        <p className="text-xs font-bold">TBA</p>
      </Section>
    </div>
  );
}
