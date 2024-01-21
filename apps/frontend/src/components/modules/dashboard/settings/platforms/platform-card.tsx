import { Button, Skeleton } from "@itsrakesh/ui";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { Heading } from "@/components/ui/heading";
import { Tooltip } from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";
import { cn } from "@itsrakesh/utils";
import { ImportDialog } from "./import-dialog";
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
    isImportOpen?: boolean;
    setIsImportOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    onDisconnect: () => void;
    iconBg?: string;
    importComponent?: React.ReactNode;
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
    isImportOpen,
    setIsImportOpen,
    onDisconnect,
    iconBg,
    importComponent,
    ...props
}: Readonly<PlatformCardProps>) {
    const [askingForConfirmation, setAskingForConfirmation] = useState(false);

    const utils = trpc.useUtils();

    const actionView = connected ? (
        <div className="flex flex-row items-center space-x-1">
            {askingForConfirmation ? (
                <AskForConfirmation
                    onCancel={() => setAskingForConfirmation(false)}
                    onConfirm={() => {
                        onDisconnect();
                        setAskingForConfirmation(false);
                        utils.platforms.getAll.invalidate();
                    }}
                    classNames={{
                        container: "border rounded-lg p-2",
                    }}
                />
            ) : (
                <Button
                    onClick={() => setAskingForConfirmation(true)}
                    size="sm"
                    variant="destructive"
                >
                    Disconnect
                </Button>
            )}
            <div className="space-x-1">
                <PlatformDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    mode="edit"
                    platform={name}
                    form={editForm}
                    tooltip="Edit account"
                >
                    <Button size="icon" variant="outline" className="h-8 w-8">
                        <Icons.Edit />
                    </Button>
                </PlatformDialog>
                {importComponent && (
                    <ImportDialog
                        open={isImportOpen ?? false}
                        onOpenChange={setIsImportOpen ?? (() => {})}
                        platform={name}
                        component={importComponent}
                        tooltip="Import posts"
                    >
                        <Button size="icon" variant="outline" className="h-8 w-8">
                            <Icons.Import />
                        </Button>
                    </ImportDialog>
                )}
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
                <Image
                    src={icon}
                    alt={name}
                    width={50}
                    height={50}
                    className={cn("rounded-lg", iconBg)}
                />
                <div className="flex flex-col justify-center">
                    <Heading level={3} className="flex flex-row items-center space-x-1">
                        <span>{name}</span>
                        {isLoading ? (
                            <Skeleton className="size-6" />
                        ) : (
                            connected && (
                                <Tooltip content="Connected" side="top">
                                    <span>
                                        <Icons.Connected className="text-success text-sm" />
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
