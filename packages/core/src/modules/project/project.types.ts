import type { Types } from "mongoose";

import type { constants } from "../../config/constants";
import type { IPagination } from "../../types/common.types";

export interface IProject {
    user_id?: Types.ObjectId;
    folder_id?: Types.ObjectId;
    title: string;
    description?: string;
    body?: {
        json?: JSON;
        html?: string;
        markdown?: string;
    };
    status: (typeof constants.project.status)[keyof typeof constants.project.status];
    cover_image?: string;
    assets?: Types.ObjectId[];
    platforms?: {
        name: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
        status?: "success" | "error";
        published_url?: string;
        id?: string;
    }[];
    canonical_url?: string;
    scheduled_at?: Date;
    pagination?: IPagination;
}

export type IProjectUpdate = Partial<IProject>;

export interface THashnodeTag {
    name: string;
    slug: string;
    _id: string;
}

export interface TTags {
    hashnode_tags?: THashnodeTag[];
    devto_tags?: string[];
    medium_tags?: string[];
    ghost_tags?: { name: string }[];
}

export interface IPost {
    project_id: Types.ObjectId;
    tags?: TTags;
    scheduled_at: Date;
    user_id: Types.ObjectId | undefined;
}
