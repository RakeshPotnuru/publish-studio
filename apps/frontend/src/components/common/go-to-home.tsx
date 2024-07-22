import Link from "next/link";

import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { siteConfig } from "@/config/site";

export function GoToHome() {
  return (
    <Button
      variant="secondary"
      size="icon"
      className="absolute left-0 top-3 z-50 h-6 w-6 rounded-none rounded-r-lg"
      title="Back to home"
    >
      <Link href={siteConfig.pages.dashboard.link}>
        <Icons.Home />
      </Link>
    </Button>
  );
}
