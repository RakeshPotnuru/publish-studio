import type { Types } from "mongoose";

import type { constants } from "../../config/constants";
import type { TPlatformName } from "../platform/platform.types";

export interface IUser {
    _id: Types.ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    profile_pic?: string;
    user_type: (typeof constants.user.userTypes)[keyof typeof constants.user.userTypes];
    platforms?: TPlatformName[];
    is_verified: boolean;
    last_login: Date;
    auth_modes: (typeof constants.user.authModes)[keyof typeof constants.user.authModes][];
    google_sub?: string;
    stripe_customer_id?: string;
}

export type IUserResponse = Omit<IUser, "password" | "google_sub">;

export type IUserUpdate = Partial<IUser>;
