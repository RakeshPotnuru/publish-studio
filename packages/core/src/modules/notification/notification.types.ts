import type { Types } from "mongoose";

export interface INotification {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    message: string;
    type: string;
    status: "sent" | "read";
    created_at: Date;
    updated_at: Date;
    expires_at: Date;
}

export type TNotificationCreateInput = Omit<INotification, "_id" | "created_at" | "updated_at">;
