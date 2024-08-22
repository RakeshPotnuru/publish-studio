import type {
  Price,
  Product,
  ScheduledChangeAction,
  Subscription,
} from "@paddle/paddle-node-sdk";
import type { Types } from "mongoose";

export interface ISubscription {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  subscription_id: Subscription["id"];
  occurred_at: Date;
  status: Subscription["status"];
  price_id?: Price["id"];
  product_id?: Product["id"];
  collection_mode: Subscription["collectionMode"];
  scheduled_change?: {
    action?: ScheduledChangeAction;
    effectiveAt?: Date;
    resumeAt?: Date;
  };
  next_billed_at?: Date;
  canceled_at?: Date;
  started_at: Date;
  created_at: Date;
  updated_at: Date;
}

export type TSubscriptionCreateInput = Omit<
  ISubscription,
  "_id" | "created_at" | "updated_at"
>;
