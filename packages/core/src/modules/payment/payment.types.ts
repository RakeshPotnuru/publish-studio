import type { Types } from "mongoose";

export interface IPayment {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  subscription_id: string;
  isPaid: boolean;
  amount: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

export type TPaymentCreateInput = Omit<
  IPayment,
  "_id" | "created_at" | "updated_at"
>;
