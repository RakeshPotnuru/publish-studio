import type { Types } from "mongoose";

import type { constants } from "../../config/constants";
import type { IPagination } from "../../types/common.types";
import type { IBlogger, IBloggerResponse } from "./blogger/blogger.types";
import type { IDevTo, IDevToResponse } from "./devto/devto.types";
import type { IGhost, IGhostResponse } from "./ghost/ghost.types";
import type { IHashnode, IHashnodeResponse } from "./hashnode/hashnode.types";
import type { IMedium, IMediumResponse } from "./medium/medium.types";
import type { IWordPress, IWordPressResponse } from "./wordpress/wordpress.types";

export type TPlatformName =
    (typeof constants.user.platforms)[keyof typeof constants.user.platforms];

type TPlatform<T extends TPlatformName> = T extends "hashnode"
    ? IHashnode
    : T extends "medium"
    ? IMedium
    : T extends "devto"
    ? IDevTo
    : T extends "ghost"
    ? IGhost
    : T extends "wordpress"
    ? IWordPress
    : T extends "blogger"
    ? IBlogger
    : never;

export interface IPlatform<T extends TPlatformName = TPlatformName> {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    name: T;
    data: TPlatform<T>;
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
