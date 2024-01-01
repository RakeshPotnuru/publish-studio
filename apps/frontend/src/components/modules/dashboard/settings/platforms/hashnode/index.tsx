import { Types } from "mongoose";

import { Images } from "@/assets/images";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { HashnodeConnectForm } from "./connect-form";
import { HashnodeEditForm } from "./edit-form";

export interface IHashnodeDefaultSettings {
    enable_table_of_contents: boolean;
    send_newsletter: boolean;
    delisted: boolean;
}

export interface IHashnodeResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic?: string;
    blog_handle?: string;
    publication: {
        publication_id: string;
        publication_logo?: string;
    };
    default_settings: IHashnodeDefaultSettings;
    created_at: Date;
    updated_at: Date;
}

interface HashnodeToProps {
    data?: IHashnodeResponse;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Hashnode({ data, isOpen, isLoading, setIsOpen }: Readonly<HashnodeToProps>) {
    const { refetch: disconnectHashnode, isFetching: isDisconnectingHashnode } =
        trpc.disconnectHashnode.useQuery(undefined, {
            enabled: false,
        });

    return (
        <PlatformCard
            onDisconnect={async () => {
                await disconnectHashnode();
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
                    default_settings={{
                        delisted: data?.default_settings.delisted.toString() ?? "false",
                        enable_table_of_contents:
                            data?.default_settings.enable_table_of_contents.toString() ?? "false",
                        send_newsletter:
                            data?.default_settings.send_newsletter.toString() ?? "false",
                    }}
                />
            }
            connectForm={<HashnodeConnectForm setIsOpen={setIsOpen} />}
        />
    );
}
