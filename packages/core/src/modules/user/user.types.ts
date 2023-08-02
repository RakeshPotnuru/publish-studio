import type { Types } from "mongoose";

import type { user } from "../../utils/constants";
import type { IDevTo } from "../platform/devto/devto.types";
import type { IHashnode } from "../platform/hashnode/hashnode.types";
import type { IMedium } from "../platform/medium/medium.types";

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
    platforms?: {
        platform: (typeof user.platforms)[keyof typeof user.platforms];
        data: IHashnode | IDevTo | IMedium;
    }[];
}
