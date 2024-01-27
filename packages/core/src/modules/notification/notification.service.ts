import { TRPCError } from "@trpc/server";

import redisClient from "../../utils/redis";
import type { INotification } from "./notification.types";

export default class NotificationService {
    async createNotification(notification: INotification) {
        try {
            await redisClient.set(
                `notification:${notification.user_id}:${notification.id}`,
                JSON.stringify(notification),
                {
                    EX: (new Date(notification.expires_at).getTime() - Date.now()) / 1000,
                },
            );

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the notification",
            });
        }
    }

    async markRead(notifications: INotification[]) {
        try {
            for (const notification of notifications) {
                await redisClient.set(
                    `notification:${notification.user_id}:${notification.id}`,
                    JSON.stringify(notification),
                    {
                        EX: Math.round(
                            (new Date(notification.expires_at).getTime() - Date.now()) / 1000,
                        ),
                    },
                );
            }

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while marking the notification as read",
            });
        }
    }

    async getNotification(id: string, user_id: string): Promise<INotification | null> {
        try {
            const notification = await redisClient.get(`notification:${user_id}:${id}`);

            return notification ? (JSON.parse(notification) as INotification) : null;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while getting the notification",
            });
        }
    }

    async getNotificationsByUserId(user_id: string): Promise<INotification[] | null> {
        try {
            const notifications = await redisClient.keys(`notification:${user_id}:*`);

            return (await Promise.all(
                notifications.map(async notification => {
                    const parsedNotification = await redisClient.get(notification);

                    return parsedNotification
                        ? (JSON.parse(parsedNotification) as INotification)
                        : null;
                }),
            )) as INotification[];
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while getting the notifications",
            });
        }
    }

    async getNotificationsByIds(ids: string[], user_id: string): Promise<INotification[] | null> {
        try {
            const notifications = await redisClient.keys(
                `notification:${user_id}:${ids.join("|")}`,
            );

            return (await Promise.all(
                notifications.map(async notification => {
                    const parsedNotification = await redisClient.get(notification);

                    return parsedNotification
                        ? (JSON.parse(parsedNotification) as INotification)
                        : null;
                }),
            )) as INotification[];
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while getting the notifications",
            });
        }
    }
}
