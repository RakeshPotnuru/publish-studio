import type { Types } from "mongoose";

export interface IMedium {
    user_id?: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic: string;
    author_id: string;
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
    content: string;
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
    title: string;
    tags: string[];
    url: string;
}
