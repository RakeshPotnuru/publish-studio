import type { Types } from "mongoose";

import { constants } from "@/config/constants";
import { Images } from "@/assets/images";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { MediumConnectForm } from "./connect-form";
import { MediumEditForm } from "./edit-form";

export type TMediumStatus =
    (typeof constants.mediumStatuses)[keyof typeof constants.mediumStatuses];

export interface IMediumResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic: string;
    author_id: string;
    default_publish_status: TMediumStatus;
    notify_followers: boolean;
    created_at: Date;
    updated_at: Date;
}

interface MediumToProps {
    data?: IMediumResponse;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Medium({ data, isOpen, isLoading, setIsOpen }: Readonly<MediumToProps>) {
    const { refetch: disconnectMedium, isFetching: isDisconnectingMedium } =
        trpc.disconnectMedium.useQuery(undefined, {
            enabled: false,
        });

    return (
        <PlatformCard
            onDisconnect={async () => {
                await disconnectMedium();
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="Medium"
            icon={Images.mediumLogo}
            isLoading={isLoading || isDisconnectingMedium}
            connected={data !== undefined}
            username={data?.username}
            profile_url={`https://medium.com/@${data?.username}`}
            editForm={
                <MediumEditForm
                    setIsOpen={setIsOpen}
                    default_publish_status={
                        data?.default_publish_status || constants.mediumStatuses.DRAFT
                    }
                    notify_followers={data?.notify_followers.toString() ?? "false"}
                />
            }
            connectForm={<MediumConnectForm setIsOpen={setIsOpen} />}
        />
    );
}
