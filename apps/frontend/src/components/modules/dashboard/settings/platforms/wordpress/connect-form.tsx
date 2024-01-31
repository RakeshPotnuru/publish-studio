import { useRouter } from "next/navigation";

import { Button } from "@itsrakesh/ui";

import { siteConfig } from "@/config/site";

export function WordPressConnectForm() {
    const router = useRouter();

    const scopes = ["users", "sites", "posts", "read", "sharing", "media"];

    const clientID = process.env.NEXT_PUBLIC_WORDPRESS_CLIENT_ID;
    const clientURL = process.env.NEXT_PUBLIC_CLIENT_URL;

    if (!clientID || !clientURL) {
        throw new Error(
            "One of NEXT_PUBLIC_WORDPRESS_CLIENT_ID or NEXT_PUBLIC_CLIENT_URL is not set",
        );
    }

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
                        `${
                            siteConfig.links.wordpressAuthorize
                        }?client_id=${clientID}&redirect_uri=${clientURL}/settings/connections/connect-wp&response_type=code&scope=${scopes.join(
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
