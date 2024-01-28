import type { Context } from "../../trpc";
import NotificationService from "./notification.service";
import type { INotification, TNotificationCreateInput } from "./notification.types";

export default class NotificationController extends NotificationService {
    async createNotificationHandler(
        input: Pick<TNotificationCreateInput, "message" | "type">,
        ctx: Context,
    ) {
        const newNotification = await super.createNotification({
            ...input,
            user_id: ctx.user._id,
            status: "sent",
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        });

        return {
            status: "success",
            data: {
                notification: newNotification,
            },
        };
    }

    async markReadHandler(input: INotification["_id"][], ctx: Context) {
        await super.markRead(input, ctx.user._id);

        return {
            status: "success",
            data: {
                message: "Notification marked as read successfully",
            },
        };
    }

    async getNotificationsHandler(ctx: Context) {
        const notifications = await super.getNotifications(ctx.user._id.toString());

        return {
            status: "success",
            data: {
                notifications,
            },
        };
    }
}
