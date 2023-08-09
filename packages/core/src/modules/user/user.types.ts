import type { Types } from "mongoose";

import type { user } from "../../utils/constants";

export interface IUser {
    _id: Types.ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    profile_pic?: string;
    user_type: "free" | "pro";
    projects?: Types.ObjectId[];
    assets?: Types.ObjectId[];
    platforms?: (typeof user.platforms)[keyof typeof user.platforms][];
}

export interface ILoginInput {
    email: string;
    password: string;
}

export interface IRegisterInput {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    profile_pic?: string;
    user_type: "free" | "pro";
}
