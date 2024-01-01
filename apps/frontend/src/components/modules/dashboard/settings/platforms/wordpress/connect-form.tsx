import { Button } from "@itsrakesh/ui";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";

export function WordPressConnectForm() {
    const router = useRouter();

    const scopes = ["users", "sites", "posts", "read", "sharing", "media"];

    return (
        <div className="space-y-4">
            <p>Access to the following scopes is required:</p>
            <ul className="list-inside list-disc">
                {scopes.map(scope => (
                    <li key={scope} className="capitalize">
                        {scope}
                    </li>
                ))}
            </ul>
            <Button
                onClick={() => {
                    router.push(
                        `${siteConfig.links.wordpressAuthorize}?client_id=${
                            process.env.NEXT_PUBLIC_WORDPRESS_CLIENT_ID
                        }&redirect_uri=${
                            process.env.NEXT_PUBLIC_CLIENT_URL
                        }/settings/integrations/connect-wp&response_type=code&scope=${scopes.join(
                            "%20",
                        )}`,
                    );
                }}
                className="w-full"
            >
                Connect
            </Button>
        </div>
    );
}
