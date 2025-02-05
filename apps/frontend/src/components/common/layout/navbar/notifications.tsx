import { useEffect, useState } from "react";

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
import type { INotification } from "@publish-studio/core";
import { constants } from "@publish-studio/core/src/config/constants";
import { intlFormatDistance } from "date-fns";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { pusher } from "@/lib/providers/trpc";
import { trpc } from "@/utils/trpc";

import { Center } from "../../../ui/center";
import { Heading } from "../../../ui/heading";
import { Tooltip } from "../../../ui/tooltip";

export function Notifications() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isNewNotification, setIsNewNotification] = useState(false);

  const { data, isFetching, error } = trpc.notifications.getAll.useQuery();

  useEffect(() => {
    if (data?.data.notifications) {
      setNotifications(data.data.notifications);
    }
  }, [data]);

  useEffect(() => {
    const handleNewNotification = (data: { message: INotification }) => {
      setNotifications([data.message, ...notifications]);

      setTimeout(handleNewNotificationTimeout, 100);
    };

    const handleNewNotificationTimeout = () => {
      setIsNewNotification(true);
      setTimeout(() => setIsNewNotification(false), 10_000);
    };

    pusher.user.bind(
      constants.pusher.events.NEW_NOTIFICATION,
      handleNewNotification,
    );

    return () => {
      pusher.user.unbind(constants.pusher.events.NEW_NOTIFICATION);
    };
  }, [notifications]);

  const { mutateAsync: markAsRead } = trpc.notifications.markRead.useMutation();

  const handleMarkAsRead = async (ids: INotification["_id"][]) => {
    try {
      await markAsRead(ids);
      setNotifications((prev) =>
        prev.map((notification) => {
          if (ids.includes(notification._id)) {
            notification.status = "read";
          }
          return notification;
        }),
      );
    } catch {
      // Ignore
    }
  };

  const bodyView =
    notifications.length > 0 ? (
      <ScrollArea className="h-96">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id.toString()}
              className="space-y-2 rounded-md border p-2"
            >
              <div className="grid grid-cols-6 items-center justify-between space-x-2">
                <p className="col-span-5 text-sm">{notification.message}</p>

                {notification.status === "sent" && (
                  <Button
                    onClick={() => handleMarkAsRead([notification._id])}
                    variant="ghost"
                    size="icon"
                    aria-label="Mark as read"
                  >
                    <Icons.Check />
                  </Button>
                )}
              </div>
              <p className="flex flex-row items-center text-xs text-muted-foreground">
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
      <Center className="h-24 text-sm text-muted-foreground">
        No new notifications
      </Center>
    );

  const bodyPendingView = isFetching ? (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={`skeleton-${index + 1}`} className="h-16 w-full" />
      ))}
    </div>
  ) : (
    bodyView
  );

  const numUnread = notifications.filter(
    (notification) => notification.status !== "read",
  ).length;

  const noun = numUnread > 1 ? "s" : "";
  const tooltip =
    numUnread > 0
      ? `You have ${numUnread} unread notification${noun}`
      : "You have no unread notifications";

  return (
    <Popover>
      <Tooltip content={tooltip}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn("rounded-full h-8 w-8", {
              "border border-success": numUnread > 0,
            })}
            aria-label="Notifications"
          >
            <Icons.Notification
              className={cn("size-4", {
                "origin-center animate-ring": isNewNotification,
              })}
            />
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="w-96" forceMount>
        <div className="flex items-center justify-between">
          <Heading level={4}>Notifications</Heading>
          <Button
            onClick={() =>
              handleMarkAsRead(
                notifications
                  .filter((n) => n.status !== "read")
                  .map((n) => n._id),
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
        ) : (
          bodyPendingView
        )}
      </PopoverContent>
    </Popover>
  );
}
