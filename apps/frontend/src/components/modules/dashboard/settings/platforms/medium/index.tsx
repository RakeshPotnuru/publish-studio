import { toast } from "@itsrakesh/ui";

import type { IMedium } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { ConnectionCard } from "../../connection-card";
import { MediumConnectForm } from "./connect-form";
import { MediumEditForm } from "./edit-form";

interface MediumToProps {
    data?: IMedium;
    isLoading: boolean;
}

export function Medium({ data, isLoading }: Readonly<MediumToProps>) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        refetch: disconnect,
        isFetching: isDisconnecting,
        error: disconnectError,
    } = trpc.platforms.medium.disconnect.useQuery(undefined, {
        enabled: false,
    });
    const utils = trpc.useUtils();

    const handleDisconnect = async () => {
        try {
            await disconnect();
            utils.platforms.getAll.invalidate();
            utils.auth.getMe.invalidate();
        } catch (error) {
            toast.error(disconnectError?.message ?? "Something went wrong.");
        }
    };

    return (
        <ConnectionCard
            onDisconnect={handleDisconnect}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="Medium"
            icon={Images.mediumLogo}
            isLoading={isLoading || isDisconnecting}
            connected={data !== undefined}
            username={data?.username}
            profile_url={`https://medium.com/@${data?.username}`}
            editForm={
                <MediumEditForm
                    setIsOpen={setIsOpen}
                    status={data?.status ?? constants.mediumStatus.DRAFT}
                    notify_followers={data?.notify_followers.toString() ?? "false"}
                />
            }
            connectForm={<MediumConnectForm setIsOpen={setIsOpen} />}
        />
    );
}
