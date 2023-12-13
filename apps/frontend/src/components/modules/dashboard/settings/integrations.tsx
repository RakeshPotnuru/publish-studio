"use client";

import { Button } from "@itsrakesh/ui";
import Image from "next/image";

import { Images } from "@/assets/images";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";
import { DevConnectForm, DevEditForm, IDevToResponse } from "./platforms/dev";
import { HashnodeConnectForm, HashnodeEditForm, IHashnodeResponse } from "./platforms/hashnode";
import { IMediumResponse, MediumConnectForm, MediumEditForm } from "./platforms/medium";
import { PlatformCard } from "./platforms/platform-card";

interface IntegrationsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Integrations({ ...props }: IntegrationsProps) {
    const { data, isFetching, error } = trpc.getAllPlatforms.useQuery({
        pagination: { page: 1, limit: 10 },
    });

    const platforms = data?.data.platforms;

    const devto = platforms?.find(platform => platform.name === constants.user.platforms.DEVTO)
        ?.data as IDevToResponse | undefined;
    const medium = platforms?.find(platform => platform.name === constants.user.platforms.MEDIUM)
        ?.data as IMediumResponse | undefined;
    const hashnode = platforms?.find(
        platform => platform.name === constants.user.platforms.HASHNODE,
    )?.data as IHashnodeResponse | undefined;

    return (
        <div className="space-y-8" {...props}>
            <div className="space-y-2">
                <Heading>Integrations</Heading>
                <p className="text-muted-foreground">
                    Configure your platforms and other integrations
                </p>
            </div>
            <div className="space-y-4">
                <Heading level={2}>Platforms</Heading>
                {error && <ErrorBox title="Error" description={error.message} />}
                <div className="grid grid-cols-2 gap-4">
                    <PlatformCard
                        name="Dev"
                        icon={Images.devLogo}
                        isLoading={isFetching}
                        connected={devto !== undefined}
                        username={devto?.username}
                        profile_url={`https://dev.to/@${devto?.username}`}
                        editForm={
                            <DevEditForm
                                default_publish_status={devto?.default_publish_status.toString()}
                            />
                        }
                        connectForm={<DevConnectForm />}
                    />
                    <PlatformCard
                        name="Medium"
                        icon={Images.mediumLogo}
                        isLoading={isFetching}
                        connected={medium !== undefined}
                        username={medium?.username}
                        profile_url={`https://medium.com/@${medium?.username}`}
                        editForm={
                            <MediumEditForm
                                default_publish_status={medium?.default_publish_status}
                                notify_followers={medium?.notify_followers.toString()}
                            />
                        }
                        connectForm={<MediumConnectForm />}
                    />
                    <PlatformCard
                        name="Hashnode"
                        icon={Images.hashnodeLogo}
                        isLoading={isFetching}
                        connected={hashnode !== undefined}
                        username={hashnode?.username}
                        profile_url={`https://hashnode.com/@${hashnode?.username}`}
                        editForm={<HashnodeEditForm username={hashnode?.username} />}
                        connectForm={<HashnodeConnectForm />}
                    />
                </div>
            </div>
            <div className="space-y-4">
                <Heading level={2}>Import your content</Heading>
                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="flex h-min flex-col space-y-2">
                        <Image
                            src={Images.mediumLogo}
                            alt="Medium"
                            width={50}
                            height={50}
                            className="rounded-lg"
                        />
                        <span>Medium</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
