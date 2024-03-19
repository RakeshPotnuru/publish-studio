"use client";

import { cn } from "@itsrakesh/utils";

import { LinkButton } from "@/components/ui/link-button";
import { siteConfig } from "@/config/site";

type FooterProps = React.HTMLAttributes<HTMLElement>;

export function Footer({ className, ...props }: Readonly<FooterProps>) {
  return (
    <footer className={cn("flex justify-center", className)} {...props}>
      <div className="flex flex-col items-center space-x-4 rounded-md bg-background px-2 py-1 sm:flex-row">
        <p className="text-sm">&copy; Publish Studio, 2024</p>
        <LinkButton href={siteConfig.pages.privacyPolicy.link} target="_parent">
          Privacy Policy
        </LinkButton>
        <LinkButton
          href={siteConfig.pages.termsOfService.link}
          target="_parent"
        >
          Terms of Service
        </LinkButton>
      </div>
    </footer>
  );
}
