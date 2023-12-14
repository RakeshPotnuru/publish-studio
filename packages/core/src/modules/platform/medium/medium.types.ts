import type { Types } from "mongoose";

import type { constants } from "../../../config/constants";

export type TMediumStatus =
    (typeof constants.mediumStatuses)[keyof typeof constants.mediumStatuses];

export interface IMedium {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic: string;
    author_id: string;
    default_publish_status: TMediumStatus;
    notify_followers: boolean;
}

export interface IMediumResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic: string;
    author_id: string;
    default_publish_status: TMediumStatus;
    notify_followers: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface IMediumUserUpdate {
    api_key?: string;
    username?: string;
    profile_pic?: string;
    author_id?: string;
    default_publish_status?: TMediumStatus;
    notify_followers?: boolean;
}

export interface IMediumUserOutput {
    errors: {
        message: string;
        code: 6003 | 6000;
    }[];
    id: string;
    username: string;
    image_url: string;
    url: string;
}

export interface IMediumCreatePostInput {
    title: string;
    contentFormat: "html" | "markdown";
    content?: string;
    tags?: string[];
    canonicalUrl?: string;
    publishStatus?: TMediumStatus;
    notifyFollowers?: boolean;
}

export interface IMediumCreatePostOutput {
    errors: {
        message: string;
        code: 6003 | 6000 | 2004 | 6026 | 2002;
    }[];
    data: {
        title: string;
        tags: string[];
        url: string;
        id: string;
    };
}
