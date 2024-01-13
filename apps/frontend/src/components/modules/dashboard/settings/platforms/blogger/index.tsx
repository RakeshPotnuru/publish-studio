import { toast } from "@itsrakesh/ui";

import type { IBlogger } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { BloggerConnectForm } from "./connect-form";
import { BloggerEditForm } from "./edit-form";

interface BloggerProps {
    data?: IBlogger;
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Blogger({ data, isOpen, isLoading, setIsOpen }: Readonly<BloggerProps>) {
    const {
        refetch: disconnectBlogger,
        isFetching: isDisconnectingBlogger,
        data: disconnectResponse,
        error: disconnectError,
    } = trpc.platforms.blogger.disconnect.useQuery(undefined, {
        enabled: false,
    });

    return (
        <PlatformCard
            onDisconnect={async () => {
                try {
                    await disconnectBlogger();
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
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="Blogger"
            icon={Images.bloggerLogo}
            isLoading={isLoading || isDisconnectingBlogger}
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
