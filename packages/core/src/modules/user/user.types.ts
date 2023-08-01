import type { Types } from "mongoose";

export interface IUser {
    _id?: Types.ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    profile_pic?: string;
    user_type: "free" | "pro";
    projects?: Types.ObjectId[];
    assets?: Types.ObjectId[];
    platforms?: Types.ObjectId[];
}
