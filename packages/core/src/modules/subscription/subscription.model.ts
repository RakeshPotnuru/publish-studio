import mongoose, { Schema } from "mongoose";

import type { ISubscription } from "./subscription.types";

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    subscription_id: { type: String, required: true },
    occurred_at: { type: Date, required: true },
    status: { type: String, required: true },
    price_id: { type: String },
    product_id: { type: String },
    collection_mode: { type: String, required: true },
    scheduled_change: { action: String, effectiveAt: Date, resumeAt: Date },
    next_billed_at: { type: Date },
    canceled_at: { type: Date },
    started_at: { type: Date, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default mongoose.model("Subscription", SubscriptionSchema);
