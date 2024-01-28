import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import Notification from "./notification.model";
import type { INotification, TNotificationCreateInput } from "./notification.types";

export default class NotificationService {
    async createNotification(notification: TNotificationCreateInput): Promise<INotification> {
        try {
            return await Notification.create(notification);
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the notification",
            });
        }
    }

    async markRead(ids: Types.ObjectId[], user_id: Types.ObjectId): Promise<boolean> {
        try {
            await Notification.updateMany({ _id: { $in: ids }, user_id }, { status: "read" });

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
            return await Notification.findOne({ _id: id, user_id });
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while getting the notification",
            });
        }
    }

    async getNotifications(user_id: string): Promise<INotification[] | null> {
        try {
            return await Notification.find({ user_id }).sort({ created_at: -1 });
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while getting the notifications",
            });
        }
    }
}
