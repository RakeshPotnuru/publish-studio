import type { Types } from "mongoose";

import type { constants } from "../../config/constants";
import type { TPlatformName } from "../platform/platform.types";

type TAuthMode = (typeof constants.user.authModes)[keyof typeof constants.user.authModes];
type TUserType = (typeof constants.user.userTypes)[keyof typeof constants.user.userTypes];

export interface IUser {
    _id: Types.ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    profile_pic?: string;
    user_type: TUserType;
    platforms?: TPlatformName[];
    is_verified: boolean;
    last_login: Date;
    auth_modes: TAuthMode[];
    google_sub?: string;
    stripe_customer_id?: string;
}

export type IUserUpdate = Partial<IUser>;
