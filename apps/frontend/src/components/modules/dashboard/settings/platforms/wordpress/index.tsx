import { toast } from "@itsrakesh/ui";

import type { IWordPress } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { WordPressConnectForm } from "./connect-form";
import { WordPressEditForm } from "./edit-form";
import { useState } from "react";

interface WordPressProps {
    data?: IWordPress;
    isLoading: boolean;
}

export function WordPress({ data, isLoading }: Readonly<WordPressProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const {
        refetch: disconnect,
        isFetching: isDisconnecting,
        data: disconnectResponse,
        error: disconnectError,
    } = trpc.platforms.wordpress.disconnect.useQuery(undefined, {
        enabled: false,
    });

    const handleDisconnect = async () => {
        try {
            await disconnect();
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
    };

    return (
        <PlatformCard
            onDisconnect={handleDisconnect}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="WordPress"
            icon={Images.wordpressLogo}
            iconBg="bg-white"
            isLoading={isLoading || isDisconnecting}
            connected={data !== undefined}
            username={data?.blog_url.split("/")[2]}
            profile_url={data?.blog_url}
            editForm={
                <WordPressEditForm
                    setIsOpen={setIsOpen}
                    status={data?.status ?? constants.wordpressStatuses.DRAFT}
                    publicize={data?.publicize.toString() ?? "false"}
                />
            }
            connectForm={<WordPressConnectForm />}
        />
    );
}
