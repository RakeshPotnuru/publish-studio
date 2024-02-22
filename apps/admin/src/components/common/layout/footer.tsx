"use client";

import Link from "next/link";

import { Button } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

import { siteConfig } from "@/config/site";

type FooterProps = React.HTMLAttributes<HTMLElement>;

export function Footer({ className, ...props }: Readonly<FooterProps>) {
  return (
    <footer
      className={cn(
        "dark:bg-background-dark flex flex-row items-center space-x-4",
        className
      )}
      {...props}
    >
      <p className="text-sm">&copy; Publish Studio</p>
      <Button variant="link" className="h-max p-0" asChild>
        <Link href={siteConfig.links.privacyPolicy} target="_blank">
          Privacy Policy
        </Link>
      </Button>
      <Button variant="link" className="h-max p-0" asChild>
        <Link href={siteConfig.links.termsOfService} target="_blank">
          Terms of Service
        </Link>
      </Button>
    </footer>
  );
}
