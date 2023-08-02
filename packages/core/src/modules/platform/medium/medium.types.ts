import type { Types } from "mongoose";

export interface IMedium {
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic: string;
    author_id: string;
}

export interface IMediumCreatePostInput {
    title: string;
    contentFormat: "html" | "markdown";
    content: string;
    tags?: string[];
    canonicalUrl?: string;
    publishStatus?: "public" | "draft" | "unlisted";
    notifyFollowers?: boolean;
}

export interface IMediumCreatePostOutput {
    title: string;
    tags: string[];
    url: string;
}

export interface IMediumUser {
    username: string;
    image_url: string;
    url: string;
}
