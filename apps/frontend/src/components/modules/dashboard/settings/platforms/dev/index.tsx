import type { IDevTo } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { trpc } from "@/utils/trpc";
import { toast } from "@itsrakesh/ui";
import { PlatformCard } from "../platform-card";
import { DevConnectForm } from "./connect-form";
import { DevEditForm } from "./edit-form";

interface DevToProps {
    data?: IDevTo;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DevTo({ data, isOpen, isLoading, setIsOpen }: Readonly<DevToProps>) {
    const {
        refetch: disconnectDevTo,
        isFetching: isDisconnectingDevTo,
        error: disconnectError,
    } = trpc.platforms.devto.disconnect.useQuery(undefined, {
        enabled: false,
    });

    return (
        <PlatformCard
            onDisconnect={async () => {
                try {
                    await disconnectDevTo();
                } catch (error) {
                    toast.error(disconnectError?.message ?? "Something went wrong.");
                }
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
                <DevEditForm setIsOpen={setIsOpen} status={data?.status.toString() ?? "false"} />
            }
            connectForm={<DevConnectForm setIsOpen={setIsOpen} />}
        />
    );
}
