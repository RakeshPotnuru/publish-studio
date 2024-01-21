import { toast } from "@itsrakesh/ui";

import type { IGhost } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { GhostConnectForm } from "./connect-form";
import { GhostEditForm } from "./edit-form";
import { useState } from "react";

export type TGhostStatus = (typeof constants.ghostStatuses)[keyof typeof constants.ghostStatuses];

interface GhostProps {
    data?: IGhost;
    isLoading: boolean;
}

export function Ghost({ data, isLoading }: Readonly<GhostProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const {
        refetch: disconnect,
        isFetching: isDisconnecting,
        error: disconnectError,
    } = trpc.platforms.ghost.disconnect.useQuery(undefined, {
        enabled: false,
    });

    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            toast.error(disconnectError?.message ?? "Something went wrong.");
        }
    };

    return (
        <PlatformCard
            onDisconnect={handleDisconnect}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="Ghost"
            icon={Images.ghostLogo}
            iconBg="bg-white"
            isLoading={isLoading || isDisconnecting}
            connected={data !== undefined}
            username={data?.api_url.split("/")[2]}
            profile_url={data?.api_url}
            editForm={
                <GhostEditForm
                    setIsOpen={setIsOpen}
                    status={data?.status ?? constants.ghostStatuses.DRAFT}
                    api_url={data?.api_url ?? ""}
                />
            }
            connectForm={<GhostConnectForm setIsOpen={setIsOpen} />}
        />
    );
}
