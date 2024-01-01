import type { Types } from "mongoose";

import { Images } from "@/assets/images";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { DevConnectForm } from "./connect-form";
import { DevEditForm } from "./edit-form";

export interface IDevToResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic: string;
    default_publish_status: boolean;
    created_at: Date;
    updated_at: Date;
}

interface DevToProps {
    data?: IDevToResponse;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DevTo({ data, isOpen, isLoading, setIsOpen }: Readonly<DevToProps>) {
    const { refetch: disconnectDevTo, isFetching: isDisconnectingDevTo } =
        trpc.disconnectDevTo.useQuery(undefined, {
            enabled: false,
        });

    return (
        <PlatformCard
            onDisconnect={async () => {
                await disconnectDevTo();
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="Dev"
            icon={Images.devLogo}
            isLoading={isLoading || isDisconnectingDevTo}
            connected={data !== undefined}
            username={data?.username}
            profile_url={`https://dev.to/@${data?.username}`}
            editForm={
                <DevEditForm
                    setIsOpen={setIsOpen}
                    default_publish_status={data?.default_publish_status.toString() ?? "false"}
                />
            }
            connectForm={<DevConnectForm setIsOpen={setIsOpen} />}
        />
    );
}
