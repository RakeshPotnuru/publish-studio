import type { Types } from "mongoose";

import type { constants } from "../../config/constants";
import type { IPagination } from "../../types/common.types";
import type { IDevTo, IDevToResponse } from "./devto/devto.types";
import type { IHashnode, IHashnodeResponse } from "./hashnode/hashnode.types";
import type { IMedium, IMediumResponse } from "./medium/medium.types";

export interface IPlatform {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    name: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
    data: IHashnode | IMedium | IDevTo;
    pagination?: IPagination;
}

export type TPlatformName =
    (typeof constants.user.platforms)[keyof typeof constants.user.platforms];

export interface IPlatformResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    name: TPlatformName;
    data: IHashnodeResponse | IMediumResponse | IDevToResponse;
    created_at: Date;
    updated_at: Date;
}

export interface IPlatformsResponse {
    platforms: IPlatformResponse[];
    pagination: IPagination;
}
