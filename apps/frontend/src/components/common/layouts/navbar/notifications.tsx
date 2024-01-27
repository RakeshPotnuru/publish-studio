import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollArea,
    Separator,
    Skeleton,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { intlFormatDistance } from "date-fns";
import { useEffect, useState } from "react";

import type { INotification } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { trpc } from "@/utils/trpc";
import { Center } from "../../../ui/center";
import { Heading } from "../../../ui/heading";
import { Tooltip } from "../../../ui/tooltip";

export function Notifications() {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [isNewNotification, setIsNewNotification] = useState(false);

    const { data, isFetching, error } = trpc.notifications.getAll.useQuery();

    useEffect(() => {
        if (data) {
            setNotifications(data);
        }
    }, [data]);

    trpc.notifications.onSend.useSubscription(undefined, {
        onData(data) {
            setNotifications(prev => [...prev, data]);
            setTimeout(() => {
                setIsNewNotification(true);
                setTimeout(() => {
                    setIsNewNotification(false);
                }, 3000);
            }, 100);
        },
    });

    const { mutateAsync: markAsRead } = trpc.notifications.markRead.useMutation();

    const handleMarkAsRead = async (ids: INotification["id"][]) => {
        try {
            await markAsRead(ids);
            setNotifications(prev =>
                prev.map(notification => {
                    if (ids.includes(notification.id)) {
                        notification.status = "read";
                    }
                    return notification;
                }),
            );
        } catch (error) {}
    };

    const numUnread = notifications.filter(notification => notification.status !== "read").length;

    const tooltip = isFetching
        ? "Loading notifications..."
        : numUnread > 0
        ? `You have ${numUnread} unread notification${numUnread > 1 ? "s" : ""}`
        : `You have no unread notifications`;

    return (
        <Popover>
            <Tooltip content={tooltip}>
                <PopoverTrigger asChild>
                    <Button size="icon" variant="ghost" className="rounded-full">
                        <Icons.Notification className="size-5" />
                        {numUnread > 0 && (
                            <Icons.Dot
                                className={cn("text-success absolute right-[124px] top-[35px]", {
                                    "animate-ping": isNewNotification,
                                })}
                            />
                        )}
                    </Button>
                </PopoverTrigger>
            </Tooltip>
            <PopoverContent className="w-96" forceMount>
                <div className="flex items-center justify-between">
                    <Heading level={4}>Notifications</Heading>
                    <Button
                        onClick={() =>
                            handleMarkAsRead(
                                notifications.filter(n => n.status !== "read").map(n => n.id),
                            )
                        }
                        variant="ghost"
                        size="sm"
                        className={cn({ "text-info": numUnread > 0 })}
                        disabled={numUnread === 0}
                    >
                        <Icons.Check className="mr-2" /> Mark all as read
                    </Button>
                </div>
                <Separator className="my-4" />
                {error ? (
                    <Center>
                        <ErrorBox
                            title="Failed to load notifications"
                            description={error.message}
                        />
                    </Center>
                ) : isFetching ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <Skeleton key={`skeleton-${index + 1}`} className="h-16 w-full" />
                        ))}
                    </div>
                ) : notifications.length ? (
                    <ScrollArea className="h-96">
                        <div className="space-y-4">
                            {notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className="space-y-2 rounded-md border p-2"
                                >
                                    <div className="grid grid-cols-6 items-center justify-between space-x-2">
                                        <p className="col-span-5 text-sm">{notification.message}</p>

                                        {notification.status === "sent" && (
                                            <Button
                                                onClick={() => handleMarkAsRead([notification.id])}
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Icons.Check />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground flex flex-row items-center text-xs">
                                        {notification.status === "sent" && (
                                            <Icons.Dot className="text-success" />
                                        )}{" "}
                                        {intlFormatDistance(
                                            new Date(notification.created_at),
                                            new Date(),
                                            {
                                                style: "narrow",
                                            },
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <Center className="text-muted-foreground h-24 text-sm">
                        No new notifications
                    </Center>
                )}
            </PopoverContent>
        </Popover>
    );
}
