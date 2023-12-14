import { Button, Skeleton } from "@itsrakesh/ui";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { Heading } from "@/components/ui/heading";
import { Tooltip } from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";
import { PlatformDialog } from "./platform-dialog";

interface PlatformCardProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    icon: string;
    isLoading: boolean;
    connected: boolean;
    username?: string;
    profile_url?: string;
    connectForm: React.ReactNode;
    editForm?: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onDisconnect: () => void;
}

export function PlatformCard({
    name,
    icon,
    isLoading,
    connected,
    username,
    profile_url,
    connectForm,
    editForm,
    isOpen,
    setIsOpen,
    onDisconnect,
    ...props
}: Readonly<PlatformCardProps>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const utils = trpc.useUtils();

    const actionView = connected ? (
        <div className="flex flex-row space-x-1">
            <AskForConfirmation
                askingForConfirmation={askingForConfirmation}
                onOpen={() => setAskingForConfirmation(true)}
                onCancel={() => setAskingForConfirmation(false)}
                onConfirm={() => {
                    onDisconnect();
                    setAskingForConfirmation(false);
                    utils.getAllPlatforms.invalidate();
                }}
            />
            <div>
                <PlatformDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    mode="edit"
                    platform={name}
                    form={editForm}
                >
                    <Button size="icon" variant="outline" className="h-8 w-8">
                        <Icons.Edit />
                        <span className="sr-only">Edit your {name} account</span>
                    </Button>
                </PlatformDialog>
            </div>
        </div>
    ) : (
        <div>
            <PlatformDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                mode="connect"
                platform={name}
                form={connectForm}
            >
                <Button size="sm">Connect</Button>
            </PlatformDialog>
        </div>
    );

    return (
        <div className="flex flex-row justify-between rounded-lg border p-4" {...props}>
            <div className="flex flex-row space-x-2">
                <Image src={icon} alt={name} width={50} height={50} className="rounded-lg" />
                <div className="flex flex-col justify-center">
                    <Heading level={3} className="flex flex-row items-center space-x-1">
                        <span>{name}</span>
                        {isLoading ? (
                            <Skeleton className="h-6 w-6" />
                        ) : (
                            connected && (
                                <Tooltip content="Connected" side="top">
                                    <span>
                                        <Icons.Connected className="text-success" />
                                    </span>
                                </Tooltip>
                            )
                        )}
                    </Heading>
                    {isLoading ? (
                        <Skeleton className="h-4 w-24" />
                    ) : (
                        connected &&
                        profile_url && (
                            <Button
                                variant="link"
                                className="text-muted-foreground h-max w-max p-0"
                                asChild
                            >
                                <Link href={profile_url} target="_blank">
                                    @{username}
                                </Link>
                            </Button>
                        )
                    )}
                </div>
            </div>
            {isLoading ? <Skeleton className="h-8 w-20" /> : actionView}
        </div>
    );
}
