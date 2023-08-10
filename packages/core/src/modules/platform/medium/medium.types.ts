import type { Types } from "mongoose";

export type default_publish_status = "public" | "draft" | "unlisted";

export interface IMedium {
    user_id?: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic: string;
    author_id: string;
    default_publish_status: default_publish_status;
    notify_followers: boolean;
}

export interface IMediumUserUpdate {
    api_key?: string;
    username?: string;
    profile_pic?: string;
    author_id?: string;
    default_publish_status?: default_publish_status;
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
    publishStatus?: "public" | "draft" | "unlisted";
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
    };
}
