import { toast } from "@itsrakesh/ui";

import type { IGhost } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { GhostConnectForm } from "./connect-form";
import { GhostEditForm } from "./edit-form";

export type TGhostStatus = (typeof constants.ghostStatuses)[keyof typeof constants.ghostStatuses];

interface GhostProps {
    data?: IGhost;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Ghost({ data, isOpen, isLoading, setIsOpen }: Readonly<GhostProps>) {
    const {
        refetch: disconnectGhost,
        isFetching: isDisconnectingGhost,
        error: disconnectError,
    } = trpc.disconnectGhost.useQuery(undefined, {
        enabled: false,
    });

    return (
        <PlatformCard
            onDisconnect={async () => {
                try {
                    await disconnectGhost();
                } catch (error) {
                    toast.error(disconnectError?.message ?? "Something went wrong.");
                }
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="Ghost"
            icon={Images.ghostLogo}
            iconBg="bg-white"
            isLoading={isLoading || isDisconnectingGhost}
            connected={data !== undefined}
            username={data?.api_url.split("/")[2]}
            profile_url={data?.api_url}
            editForm={
                <GhostEditForm
                    setIsOpen={setIsOpen}
                    default_publish_status={
                        data?.default_publish_status ?? constants.ghostStatuses.DRAFT
                    }
                    api_url={data?.api_url ?? ""}
                />
            }
            connectForm={<GhostConnectForm setIsOpen={setIsOpen} />}
        />
    );
}
