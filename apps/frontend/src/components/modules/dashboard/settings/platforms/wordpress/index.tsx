import { toast } from "@itsrakesh/ui";

import type { IWordPress } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { WordPressConnectForm } from "./connect-form";
import { WordPressEditForm } from "./edit-form";

interface WordPressProps {
    data?: IWordPress;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function WordPress({ data, isOpen, isLoading, setIsOpen }: Readonly<WordPressProps>) {
    const {
        refetch: disconnectWordPress,
        isFetching: isDisconnectingWordPress,
        data: disconnectResponse,
        error: disconnectError,
    } = trpc.platforms.wordpress.disconnect.useQuery(undefined, {
        enabled: false,
    });

    return (
        <PlatformCard
            onDisconnect={async () => {
                try {
                    await disconnectWordPress();
                    toast.success(disconnectResponse?.data.message, {
                        action: {
                            label: "Open",
                            onClick: () => {
                                window.open(siteConfig.links.wordpressConnectedApps, "_blank");
                            },
                        },
                    });
                } catch (error) {
                    toast.error(disconnectError?.message ?? "Something went wrong.");
                }
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="WordPress"
            icon={Images.wordpressLogo}
            iconBg="bg-white"
            isLoading={isLoading || isDisconnectingWordPress}
            connected={data !== undefined}
            username={data?.blog_url.split("/")[2]}
            profile_url={data?.blog_url}
            editForm={
                <WordPressEditForm
                    setIsOpen={setIsOpen}
                    default_publish_status={
                        data?.default_publish_status ?? constants.wordpressStatuses.DRAFT
                    }
                    publicize={data?.publicize.toString() ?? "false"}
                />
            }
            connectForm={<WordPressConnectForm />}
        />
    );
}
