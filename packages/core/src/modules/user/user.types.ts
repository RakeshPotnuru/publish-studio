import type { Types } from "mongoose";

import type { user } from "../../constants";

export interface IUser {
    _id: Types.ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    profile_pic?: string;
    user_type: (typeof user.userTypes)[keyof typeof user.userTypes];
    projects?: Types.ObjectId[];
    assets?: Types.ObjectId[];
    platforms?: (typeof user.platforms)[keyof typeof user.platforms][];
    is_verified: boolean;
    last_login: Date;
    auth_modes: (typeof user.authModes)[keyof typeof user.authModes][];
    google_sub?: string;
    stripe_customer_id?: string;
}

export type IUserUpdate = Partial<IUser>;
