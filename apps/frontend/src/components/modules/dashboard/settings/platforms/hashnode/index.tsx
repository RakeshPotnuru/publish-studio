import { toast } from "@itsrakesh/ui";

import type { IHashnode } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { HashnodeConnectForm } from "./connect-form";
import { HashnodeEditForm } from "./edit-form";
import { useState } from "react";

interface HashnodeToProps {
    data?: IHashnode;
    isLoading: boolean;
}

export function Hashnode({ data, isLoading }: Readonly<HashnodeToProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const {
        refetch: disconnect,
        isFetching: isDisconnecting,
        error: disconnectError,
    } = trpc.platforms.hashnode.disconnect.useQuery(undefined, {
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
            name="Hashnode"
            icon={Images.hashnodeLogo}
            isLoading={isLoading || isDisconnecting}
            connected={data !== undefined}
            username={data?.username}
            profile_url={`https://hashnode.com/@${data?.username}`}
            editForm={
                <HashnodeEditForm
                    setIsOpen={setIsOpen}
                    settings={{
                        delisted: data?.settings.delisted.toString() ?? "false",
                        enable_table_of_contents:
                            data?.settings.enable_table_of_contents.toString() ?? "false",
                        send_newsletter: data?.settings.send_newsletter.toString() ?? "false",
                    }}
                />
            }
            connectForm={<HashnodeConnectForm setIsOpen={setIsOpen} />}
        />
    );
}
