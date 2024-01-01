"use client";

import { Button } from "@itsrakesh/ui";
import Image from "next/image";

import { Images } from "@/assets/images";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { constants } from "@/config/constants";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { DevTo, IDevToResponse } from "./platforms/dev";
import { Ghost, IGhostResponse } from "./platforms/ghost";
import { Hashnode, IHashnodeResponse } from "./platforms/hashnode";
import { IMediumResponse, Medium } from "./platforms/medium";
import { IWordPressResponse, WordPress } from "./platforms/wordpress";

interface IntegrationsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Integrations({ ...props }: IntegrationsProps) {
    const [isDevOpen, setIsDevOpen] = useState(false);
    const [isMediumOpen, setIsMediumOpen] = useState(false);
    const [isHashnodeOpen, setIsHashnodeOpen] = useState(false);
    const [isGhostOpen, setIsGhostOpen] = useState(false);
    const [isWordPressOpen, setIsWordPressOpen] = useState(false);

    const { data, isFetching, error } = trpc.getAllPlatforms.useQuery({
        pagination: { page: 1, limit: 10 },
    });

    const platforms = data?.data.platforms;

    const devto = platforms?.find(platform => platform.name === constants.user.platforms.DEVTO)
        ?.data as IDevToResponse;
    const medium = platforms?.find(platform => platform.name === constants.user.platforms.MEDIUM)
        ?.data as IMediumResponse;
    const hashnode = platforms?.find(
        platform => platform.name === constants.user.platforms.HASHNODE,
    )?.data as IHashnodeResponse;
    const ghost = platforms?.find(platform => platform.name === constants.user.platforms.GHOST)
        ?.data as IGhostResponse;
    const wordpress = platforms?.find(
        platform => platform.name === constants.user.platforms.WORDPRESS,
    )?.data as IWordPressResponse;

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
                    <DevTo
                        isLoading={isFetching}
                        isOpen={isDevOpen}
                        setIsOpen={setIsDevOpen}
                        data={devto}
                    />
                    <Ghost
                        isLoading={isFetching}
                        isOpen={isGhostOpen}
                        setIsOpen={setIsGhostOpen}
                        data={ghost}
                    />
                    <Hashnode
                        isLoading={isFetching}
                        isOpen={isHashnodeOpen}
                        setIsOpen={setIsHashnodeOpen}
                        data={hashnode}
                    />
                    <Medium
                        isLoading={isFetching}
                        isOpen={isMediumOpen}
                        setIsOpen={setIsMediumOpen}
                        data={medium}
                    />
                    <WordPress
                        isLoading={isFetching}
                        isOpen={isWordPressOpen}
                        setIsOpen={setIsWordPressOpen}
                        data={wordpress}
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
