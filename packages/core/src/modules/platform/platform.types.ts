import type { Types } from "mongoose";

import type { constants } from "../../config/constants";
import type { IPagination } from "../../types/common.types";
import type { IBloggerResponse } from "./blogger/blogger.types";
import type { IDevToResponse } from "./devto/devto.types";
import type { IGhostResponse } from "./ghost/ghost.types";
import type { IHashnodeResponse } from "./hashnode/hashnode.types";
import type { IMediumResponse } from "./medium/medium.types";
import type { IWordPressResponse } from "./wordpress/wordpress.types";

export type TPlatformName =
    (typeof constants.user.platforms)[keyof typeof constants.user.platforms];

export interface IPlatform {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    name: TPlatformName;
    data: Types.ObjectId;
    pagination?: IPagination;
}

type TPlatformResponse<T extends TPlatformName> = T extends "hashnode"
    ? IHashnodeResponse
    : T extends "medium"
    ? IMediumResponse
    : T extends "devto"
    ? IDevToResponse
    : T extends "ghost"
    ? IGhostResponse
    : T extends "wordpress"
    ? IWordPressResponse
    : T extends "blogger"
    ? IBloggerResponse
    : never;

export interface IPlatformResponse<T extends TPlatformName = TPlatformName> {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    name: T;
    data: TPlatformResponse<T>;
    created_at: Date;
    updated_at: Date;
}

export interface IPlatformsResponse {
    platforms: IPlatformResponse[];
    pagination: IPagination;
}
