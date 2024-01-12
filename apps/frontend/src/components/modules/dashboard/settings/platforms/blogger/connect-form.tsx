import { Button } from "@itsrakesh/ui";
import { useRouter } from "next/navigation";

import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { trpc } from "@/utils/trpc";

export function BloggerConnectForm() {
    const router = useRouter();

    const scopes = ["manage your blogger account"];

    const { refetch: getAuthUrl, isFetching } = trpc.platforms.blogger.getAuthUrl.useQuery(
        undefined,
        {
            enabled: false,
        },
    );

    const handleAuthenticate = async () => {
        try {
            const { data } = await getAuthUrl();

            if (data?.data.authUrl) {
                router.push(data?.data.authUrl);
            }
        } catch (error) {}
    };

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
            <Button onClick={handleAuthenticate} className="w-full" disabled={isFetching}>
                <ButtonLoader isLoading={isFetching}>Connect</ButtonLoader>
            </Button>
        </div>
    );
}
