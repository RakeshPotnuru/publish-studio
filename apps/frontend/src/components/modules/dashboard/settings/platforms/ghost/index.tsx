import type { Types } from "mongoose";

import { constants } from "@/config/constants";
import { Images } from "@/assets/images";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { GhostConnectForm } from "./connect-form";
import { GhostEditForm } from "./edit-form";

export type TGhostStatus = (typeof constants.ghostStatuses)[keyof typeof constants.ghostStatuses];

export interface IGhostResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_url: string;
    admin_api_key: string;
    default_publish_status: TGhostStatus;
    created_at: Date;
    updated_at: Date;
}

interface GhostProps {
    data?: IGhostResponse;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Ghost({ data, isOpen, isLoading, setIsOpen }: Readonly<GhostProps>) {
    const { refetch: disconnectGhost, isFetching: isDisconnectingGhost } =
        trpc.disconnectGhost.useQuery(undefined, {
            enabled: false,
        });

    return (
        <PlatformCard
            onDisconnect={async () => {
                await disconnectGhost();
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
                        data?.default_publish_status || constants.ghostStatuses.DRAFT
                    }
                    api_url={data?.api_url ?? ""}
                />
            }
            connectForm={<GhostConnectForm setIsOpen={setIsOpen} />}
        />
    );
}
