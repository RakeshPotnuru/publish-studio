"use client";

import { Heading } from "@/components/ui/heading";
import { Button } from "@itsrakesh/ui";
import Image from "next/image";
import Link from "next/link";

interface IntegrationsProps extends React.HTMLAttributes<HTMLDivElement> {}

interface ConnectedPlatformCardProps {
    name: string;
    icon: string;
    connected: true;
    username: string;
    profile_url: string;
    profile_pic: string;
}

interface DisconnectedPlatformCardProps {
    name: string;
    icon: string;
    connected: false;
    username?: string;
    profile_url?: string;
    profile_pic?: string;
}

type PlatformCardProps = ConnectedPlatformCardProps | DisconnectedPlatformCardProps;

const PlatformCard = ({
    name,
    icon,
    connected,
    username,
    profile_url,
    profile_pic,
    ...props
}: PlatformCardProps & React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className="flex flex-row justify-between rounded-lg border p-4" {...props}>
            <div className="flex flex-col space-y-2">
                <div className="flex flex-row space-x-2">
                    <Image src={icon} alt={name} width={50} height={50} className="rounded-lg" />
                    <div className="flex flex-col justify-center">
                        <Heading level={3} className="">
                            {name}
                        </Heading>
                    </div>
                </div>
                {connected && (
                    <Link href={profile_url}>
                        <Button
                            variant="link"
                            className="text-muted-foreground h-max space-x-1 p-0"
                        >
                            <Image
                                src={profile_pic}
                                alt={username}
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <span>@{username}</span>
                        </Button>
                    </Link>
                )}
            </div>
            {connected ? (
                <Button size="sm" variant="destructive">
                    Disconnect
                </Button>
            ) : (
                <Button size="sm">Connect</Button>
            )}
        </div>
    );
};

export function Integrations({ ...props }: IntegrationsProps) {
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
                <div className="grid grid-cols-2 gap-4">
                    <PlatformCard
                        name="Dev"
                        icon="/images/platforms/dev-logo.png"
                        connected={true}
                        username="itsrakesh"
                        profile_url="https://dev.to/@itsrakesh"
                        profile_pic="/images/logo.png"
                    />
                    <PlatformCard
                        name="Medium"
                        icon="/images/platforms/medium-logo.jpeg"
                        connected={false}
                    />
                    <PlatformCard
                        name="Hashnode"
                        icon="/images/platforms/hashnode-logo.jpeg"
                        connected={false}
                    />
                </div>
            </div>
        </div>
    );
}
