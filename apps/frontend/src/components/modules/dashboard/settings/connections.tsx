"use client";

import type { IPlatform } from "@publish-studio/core";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";

import { Cloudinary } from "./integrations/cloudinary";
import { Blogger } from "./platforms/blogger";
import { DevTo } from "./platforms/dev";
import { Ghost } from "./platforms/ghost";
import { Hashnode } from "./platforms/hashnode";
import { Medium } from "./platforms/medium";
import { WordPress } from "./platforms/wordpress";

type IntegrationsProps = React.HTMLAttributes<HTMLDivElement>;

export function Connections({ ...props }: IntegrationsProps) {
    const {
        data,
        isFetching,
        error: platformsError,
    } = trpc.platforms.getAll.useQuery({
        pagination: { page: 1, limit: 10 },
    });

    const platforms = data?.data.platforms;

    const devto: IPlatform<typeof constants.user.platforms.DEVTO> | undefined = platforms?.find(
        platform => platform.name === constants.user.platforms.DEVTO,
    )?.data;
    const medium: IPlatform<typeof constants.user.platforms.MEDIUM> | undefined = platforms?.find(
        platform => platform.name === constants.user.platforms.MEDIUM,
    )?.data;
    const hashnode: IPlatform<typeof constants.user.platforms.HASHNODE> | undefined =
        platforms?.find(platform => platform.name === constants.user.platforms.HASHNODE)?.data;
    const ghost: IPlatform<typeof constants.user.platforms.GHOST> | undefined = platforms?.find(
        platform => platform.name === constants.user.platforms.GHOST,
    )?.data;
    const wordpress: IPlatform<typeof constants.user.platforms.WORDPRESS> | undefined =
        platforms?.find(platform => platform.name === constants.user.platforms.WORDPRESS)?.data;
    const blogger: IPlatform<typeof constants.user.platforms.BLOGGER> | undefined = platforms?.find(
        platform => platform.name === constants.user.platforms.BLOGGER,
    )?.data;

    const {
        data: cloudinary,
        isFetching: isCloudinaryLoading,
        error: cloudinaryError,
    } = trpc.cloudinary.get.useQuery();

    return (
        <div className="space-y-8" {...props}>
            <div className="space-y-2">
                <Heading>Connections</Heading>
                <p className="text-muted-foreground">
                    Configure your platforms and other integrations
                </p>
            </div>
            <div className="space-y-4">
                <Heading level={2}>Platforms</Heading>
                {platformsError && (
                    <Center>
                        <ErrorBox title="Error" description={platformsError.message} />
                    </Center>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <Blogger isLoading={isFetching} data={blogger} />
                    <DevTo isLoading={isFetching} data={devto} />
                    <Ghost isLoading={isFetching} data={ghost} />
                    <Hashnode isLoading={isFetching} data={hashnode} />
                    <Medium isLoading={isFetching} data={medium} />
                    <WordPress isLoading={isFetching} data={wordpress} />
                </div>
            </div>
            <div className="space-y-4">
                <Heading level={2}>Integrations</Heading>
                {cloudinaryError && (
                    <Center>
                        <ErrorBox title="Error" description={cloudinaryError.message} />
                    </Center>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <Cloudinary
                        isLoading={isCloudinaryLoading}
                        data={cloudinary?.data.integration ?? undefined}
                    />
                </div>
            </div>
        </div>
    );
}
