import type { Types } from "mongoose";

import type { constants } from "../../config/constants";
import type { IPagination } from "../../types/common.types";
import type { IDevTo, IDevToResponse } from "./devto/devto.types";
import type { IGhost } from "./ghost/ghost.types";
import type { IHashnode, IHashnodeResponse } from "./hashnode/hashnode.types";
import type { IMedium, IMediumResponse } from "./medium/medium.types";
import type { IWordPress } from "./wordpress/wordpress.types";

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
    ? IGhost
    : T extends "wordpress"
    ? IWordPress
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
