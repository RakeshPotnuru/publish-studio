import { Icons } from "@/assets/icons";
import { Button } from "@itsrakesh/ui";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function EmptyState() {
    return (
        <div className="text-muted-foreground flex h-full flex-col items-center justify-center space-y-4 text-center">
            <p>
                Looks like you haven&apos;t connected any accounts yet. Connect your accounts and
                get your content rolling.
            </p>
            <Button asChild>
                <Link href={siteConfig.pages.settings.integrations.link}>
                    <Icons.Connect className="mr-2 h-4 w-4" />
                    Connect
                </Link>
            </Button>
        </div>
    );
}
