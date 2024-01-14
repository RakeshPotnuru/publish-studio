import { toast } from "@itsrakesh/ui";

import type { IHashnode } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { HashnodeConnectForm } from "./connect-form";
import { HashnodeEditForm } from "./edit-form";

interface HashnodeToProps {
    data?: IHashnode;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Hashnode({ data, isOpen, isLoading, setIsOpen }: Readonly<HashnodeToProps>) {
    const {
        refetch: disconnectHashnode,
        isFetching: isDisconnectingHashnode,
        error: disconnectError,
    } = trpc.platforms.hashnode.disconnect.useQuery(undefined, {
        enabled: false,
    });

    return (
        <PlatformCard
            onDisconnect={async () => {
                try {
                    await disconnectHashnode();
                } catch (error) {
                    toast.error(disconnectError?.message ?? "Something went wrong.");
                }
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="Hashnode"
            icon={Images.hashnodeLogo}
            isLoading={isLoading || isDisconnectingHashnode}
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
