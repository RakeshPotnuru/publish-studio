import type { Types } from "mongoose";

import type { constants } from "../../config/constants";
import type { TPlatformName } from "../platform/platform.types";
import type { IProject } from "../project/project.types";

export type TPostStatus = (typeof constants.postStatus)[keyof typeof constants.postStatus];

export interface IPost {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    project_id: Types.ObjectId;
    post_id?: string;
    platform: TPlatformName;
    status?: TPostStatus;
    published_url?: string;
    published_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export type TPostCreateInput = Omit<IPost, "_id" | "created_at" | "updated_at">;

export type TPostUpdateInput = Partial<TPostCreateInput>;

export interface IPublish {
    platforms: TPlatformName[];
    project_id: Types.ObjectId;
    scheduled_at?: Date;
    user_id: Types.ObjectId;
}

export interface ISchedule {
    platforms: TPlatformName[];
    project: IProject;
    scheduled_at: Date;
    user_id: Types.ObjectId;
}

export type TEdit = Omit<IPublish, "scheduled_at">;
