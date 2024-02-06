import Link from "next/link";

import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { siteConfig } from "@/config/site";

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
      <p>
        Looks like you haven&apos;t connected any accounts yet. Connect your
        accounts and get your content rolling.
      </p>
      <Button asChild>
        <Link href={siteConfig.pages.settings.connections.link}>
          <Icons.Connect className="mr-2 size-4" />
          Connect
        </Link>
      </Button>
    </div>
  );
}
