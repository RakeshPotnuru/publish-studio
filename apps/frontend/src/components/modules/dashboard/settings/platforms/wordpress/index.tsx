import { ToastAction, useToast } from "@itsrakesh/ui";
import type { Types } from "mongoose";
import Link from "next/link";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { WordPressConnectForm } from "./connect-form";
import { WordPressEditForm } from "./edit-form";

export type TWordPressStatus =
    (typeof constants.wordpressStatuses)[keyof typeof constants.wordpressStatuses];

export interface IWordPressResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    blog_url: string;
    blog_id: string;
    token: string;
    publicize: boolean;
    default_publish_status: TWordPressStatus;
    created_at: Date;
    updated_at: Date;
}

interface WordPressProps {
    data?: IWordPressResponse;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function WordPress({ data, isOpen, isLoading, setIsOpen }: Readonly<WordPressProps>) {
    const {
        refetch: disconnectWordPress,
        isFetching: isDisconnectingWordPress,
        data: disconnectResponse,
    } = trpc.disconnectWordPress.useQuery(undefined, {
        enabled: false,
    });

    const { toast } = useToast();

    return (
        <PlatformCard
            onDisconnect={async () => {
                try {
                    await disconnectWordPress();
                    toast({
                        variant: "success",
                        title: "Disconnected",
                        description: disconnectResponse?.data.message,
                        action: (
                            <ToastAction altText="Open link">
                                <Link
                                    href={siteConfig.links.wordpressConnectedApps}
                                    target="_blank"
                                >
                                    Open
                                </Link>
                            </ToastAction>
                        ),
                    });
                } catch (error) {}
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="WordPress"
            icon={Images.wordpressLogo}
            iconBg="bg-white"
            isLoading={isLoading || isDisconnectingWordPress}
            connected={data !== undefined}
            username={data?.blog_url.split("/")[2]}
            profile_url={data?.blog_url}
            editForm={
                <WordPressEditForm
                    setIsOpen={setIsOpen}
                    default_publish_status={
                        data?.default_publish_status ?? constants.wordpressStatuses.DRAFT
                    }
                    publicize={data?.publicize.toString() ?? "false"}
                />
            }
            connectForm={<WordPressConnectForm />}
        />
    );
}
