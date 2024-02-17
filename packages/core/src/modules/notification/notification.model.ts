import mongoose, { Schema } from "mongoose";

import type { INotification } from "./notification.types";

const NotificationSchema = new Schema<INotification>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ["sent", "read"], required: true },
    expires_at: { type: Date, required: true, expires: 0 },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default mongoose.model("Notification", NotificationSchema);
