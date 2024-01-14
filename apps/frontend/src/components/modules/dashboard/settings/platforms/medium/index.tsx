import { toast } from "@itsrakesh/ui";

import type { IMedium } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { MediumConnectForm } from "./connect-form";
import { MediumEditForm } from "./edit-form";

interface MediumToProps {
    data?: IMedium;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Medium({ data, isOpen, isLoading, setIsOpen }: Readonly<MediumToProps>) {
    const {
        refetch: disconnectMedium,
        isFetching: isDisconnectingMedium,
        error: disconnectError,
    } = trpc.platforms.medium.disconnect.useQuery(undefined, {
        enabled: false,
    });

    return (
        <PlatformCard
            onDisconnect={async () => {
                try {
                    await disconnectMedium();
                } catch (error) {
                    toast.error(disconnectError?.message ?? "Something went wrong.");
                }
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
                    status={data?.status ?? constants.mediumStatuses.DRAFT}
                    notify_followers={data?.notify_followers.toString() ?? "false"}
                />
            }
            connectForm={<MediumConnectForm setIsOpen={setIsOpen} />}
        />
    );
}
