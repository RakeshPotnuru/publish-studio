import Link from "next/link";

import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { siteConfig } from "@/config/site";

export function GoToHome() {
  return (
    <Button
      variant="secondary"
      size="icon"
      className="absolute -left-2 top-8 z-50 rounded-none rounded-r-lg hover:left-0 hover:animate-slide-right"
      title="Back to home"
    >
      <Link href={siteConfig.pages.dashboard.link}>
        <Icons.Home />
      </Link>
    </Button>
  );
}
