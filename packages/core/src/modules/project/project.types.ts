import type { Types } from "mongoose";

import type { constants } from "../../config/constants";
import type { IPagination } from "../../types/common.types";
import type { TPlatformName } from "../platform/platform.types";

export type TProjectStatus =
    (typeof constants.project.status)[keyof typeof constants.project.status];

export interface IProject {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    folder_id?: Types.ObjectId;
    title: string;
    description?: string;
    body?: {
        json?: JSON;
        html?: string;
        markdown?: string;
    };
    status: TProjectStatus;
    cover_image?: string;
    assets?: Types.ObjectId[];
    platforms?: {
        name: TPlatformName;
        status?: "success" | "error";
        published_url?: string;
        id?: string;
    }[];
    canonical_url?: string;
    scheduled_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface IProjectResponse {
    _id: Types.ObjectId;
    title: string;
    user_id: Types.ObjectId;
    folder_id?: Types.ObjectId;
    description?: string;
    body?: {
        json?: JSON;
        html?: string;
        markdown?: string;
    };
    status: TProjectStatus;
    cover_image?: string;
    assets?: Types.ObjectId[];
    platforms?: {
        name: TPlatformName;
        status?: "success" | "error";
        published_url?: string;
        id?: string;
        _id: Types.ObjectId;
    }[];
    canonical_url?: string;
    scheduled_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface IProjectsResponse {
    projects: IProjectResponse[];
    pagination: IPagination;
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
