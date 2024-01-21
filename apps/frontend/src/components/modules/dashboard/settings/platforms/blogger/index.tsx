import { toast } from "@itsrakesh/ui";

import type { IBlogger } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { BloggerConnectForm } from "./connect-form";
import { BloggerEditForm } from "./edit-form";
import { useState } from "react";

interface BloggerProps {
    data?: IBlogger;
    isLoading: boolean;
}

export function Blogger({ data, isLoading }: Readonly<BloggerProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const {
        refetch: disconnect,
        isFetching: isDisconnecting,
        data: disconnectResponse,
        error: disconnectError,
    } = trpc.platforms.blogger.disconnect.useQuery(undefined, {
        enabled: false,
    });

    const handleDisconnect = async () => {
        try {
            await disconnect();
            toast.success(disconnectResponse?.data.message, {
                action: {
                    label: "Open",
                    onClick: () => {
                        window.open(siteConfig.links.wordpressConnectedApps, "_blank");
                    },
                },
            });
        } catch (error) {
            toast.error(disconnectError?.message ?? "Something went wrong.");
        }
    };

    return (
        <PlatformCard
            onDisconnect={handleDisconnect}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="Blogger"
            icon={Images.bloggerLogo}
            isLoading={isLoading || isDisconnecting}
            connected={data !== undefined}
            username={data?.blog_url.split("/")[2]}
            profile_url={data?.blog_url}
            editForm={
                <BloggerEditForm
                    setIsOpen={setIsOpen}
                    blog_id={data?.blog_id ?? ""}
                    blog_url={data?.blog_url ?? ""}
                    status={data?.status.toString() ?? "false"}
                />
            }
            connectForm={<BloggerConnectForm />}
        />
    );
}
