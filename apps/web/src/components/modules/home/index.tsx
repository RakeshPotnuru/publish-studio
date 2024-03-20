"use client";

import { IconBook2, IconLifebuoy, IconLogin } from "@tabler/icons-react";

import { FloatingNav } from "@/components/ui/floating-navbar";
import { siteConfig } from "@/config/site";

import { Cta } from "./cta";
import { Features } from "./features";
import { Hero } from "./hero";
import { Integrations } from "./integrations";
import { Platforms } from "./platforms";

export function Home() {
  const navItems = [
    {
      name: "Docs",
      link: {
        href: "https://docs.publishstudio.one",
        target: "_blank",
      },
      icon: <IconBook2 className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },

    {
      name: "Support",
      link: {
        href: "mailto:support@publishstudio.one?subject=%5BLANDING%5D%3A%20Write%20your%20subject%20here",
      },
      icon: (
        <IconLifebuoy className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    {
      name: "Login",
      link: {
        href: `${siteConfig.links.mainApp}/login`,
      },
      icon: <IconLogin className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <>
      <FloatingNav navItems={navItems} />
      <Hero />
      <Platforms />
      <Integrations />
      <Features />
      <Cta />
    </>
  );
}
