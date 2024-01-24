import type { Types } from "mongoose";

export interface ICloudinary {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    cloud_name: string;
    api_key: string;
    created_at: Date;
    updated_at: Date;
}

export type TCloudinaryCreateInput = Omit<ICloudinary, "_id" | "created_at" | "updated_at">;

export type TCloudinaryUpdateInput = Omit<Partial<TCloudinaryCreateInput>, "user_id">;
