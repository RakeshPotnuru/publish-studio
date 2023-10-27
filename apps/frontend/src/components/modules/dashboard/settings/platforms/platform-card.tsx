import { Button } from "@itsrakesh/ui";
import Image from "next/image";
import Link from "next/link";

import { Heading } from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { useState } from "react";
import { PlatformDialog } from "./platform-dialog";

interface PlatformCardBaseProps {
    name: string;
    icon: string;
}

interface ConnectedPlatformCardProps extends PlatformCardBaseProps {
    connected: true;
    username: string;
    profile_url: string;
    connectForm?: React.ReactNode;
    editForm: React.ReactNode;
}

interface DisconnectedPlatformCardProps extends PlatformCardBaseProps {
    connected: false;
    username?: string;
    profile_url?: string;
    connectForm: React.ReactNode;
    editForm?: React.ReactNode;
}

type PlatformCardProps = ConnectedPlatformCardProps | DisconnectedPlatformCardProps;

export function PlatformCard({
    name,
    icon,
    connected,
    username,
    profile_url,
    connectForm,
    editForm,
    ...props
}: PlatformCardProps & React.HTMLAttributes<HTMLDivElement>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    return (
        <div className="flex flex-row justify-between rounded-lg border p-4" {...props}>
            <div className="flex flex-row space-x-2">
                <Image src={icon} alt={name} width={50} height={50} className="rounded-lg" />
                <div className="flex flex-col justify-center">
                    <Heading level={3} className="flex flex-row items-center space-x-1">
                        <span>{name}</span>
                        {connected && (
                            <Tooltip content="Connected" side="top">
                                <span>
                                    <Icons.connected className="text-success" />
                                </span>
                            </Tooltip>
                        )}
                    </Heading>
                    {connected && (
                        <Button
                            variant="link"
                            className="text-muted-foreground h-max w-max p-0"
                            asChild
                        >
                            <Link href={profile_url} target="_blank">
                                @{username}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
            {connected ? (
                <div className="flex flex-row space-x-1">
                    {askingForConfirmation ? (
                        <div className="space-x-1 text-sm">
                            <span>Confirm?</span>
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                                <Icons.check />
                            </Button>
                            <Button
                                onClick={() => setAskingForConfirmation(false)}
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Icons.close />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => setAskingForConfirmation(true)}
                            size="sm"
                            variant="destructive"
                        >
                            Disconnect
                        </Button>
                    )}
                    <div>
                        <PlatformDialog mode="edit" platform={name} form={editForm}>
                            <Button size="icon" variant="outline" className="h-8 w-8">
                                <Icons.edit />
                                <span className="sr-only">Edit your {name} account</span>
                            </Button>
                        </PlatformDialog>
                    </div>
                </div>
            ) : (
                <div>
                    <PlatformDialog mode="connect" platform={name} form={connectForm}>
                        <Button size="sm">Connect</Button>
                    </PlatformDialog>
                </div>
            )}
        </div>
    );
}
