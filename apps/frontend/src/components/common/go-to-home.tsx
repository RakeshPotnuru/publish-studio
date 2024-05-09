import Link from "next/link";

import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { siteConfig } from "@/config/site";

import { Tooltip } from "../ui/tooltip";

export function GoToHome() {
  return (
    <Button
      variant="secondary"
      size="icon"
      className="absolute -left-2 top-8 z-50 rounded-none rounded-r-lg hover:left-0 hover:animate-slide-right"
    >
      <Tooltip content="Back to home" side="right">
        <Link href={siteConfig.pages.dashboard.link}>
          <Icons.Home />
        </Link>
      </Tooltip>
    </Button>
  );
}
