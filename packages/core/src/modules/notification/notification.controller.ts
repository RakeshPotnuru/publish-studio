import { v4 as uuidV4 } from "uuid";

import type { Context } from "../../trpc";
import NotificationService from "./notification.service";
import type { INotification } from "./notification.types";

export default class NotificationController extends NotificationService {
    async createNotificationHandler(input: Pick<INotification, "message" | "type">, ctx: Context) {
        const notification: INotification = {
            id: uuidV4(),
            user_id: ctx.user._id.toString(),
            message: input.message,
            type: input.type,
            status: "sent",
            created_at: new Date(),
            updated_at: new Date(),
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        };

        await super.createNotification(notification);

        return notification;
    }

    async markReadHandler(input: INotification["id"][], ctx: Context) {
        const notifications = await super.getNotificationsByIds(input, ctx.user._id.toString());

        if (!notifications) {
            return;
        }

        for (const notification of notifications) {
            notification.status = "read";
            notification.updated_at = new Date();
        }

        await super.markRead(notifications);

        return true;
    }

    async getNotificationsHandler(ctx: Context) {
        const notifications = await super.getNotificationsByUserId(ctx.user._id.toString());

        return notifications?.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    }
}
