"use client";

import { cn } from "@itsrakesh/utils";

import { LinkButton } from "@/components/ui/link-button";
import { siteConfig } from "@/config/site";

type FooterProps = React.HTMLAttributes<HTMLElement>;

export function Footer({ className, ...props }: Readonly<FooterProps>) {
  return (
    <footer
      className={cn(
        "dark:bg-background-dark flex relative bottom-4 bg-background w-full justify-center",
        className
      )}
      {...props}
    >
      <div className="flex flex-row space-x-4 rounded-md border p-1 px-2">
        <p className="text-sm">&copy; Publish Studio</p>
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
