import type { Types } from "mongoose";

export interface IDevTo {
    user_id?: Types.ObjectId;
    api_key: string;
    username?: string;
    profile_pic?: string;
    default_publish_status: boolean;
}

export interface IDevToUserUpdate {
    api_key?: string;
    username?: string;
    profile_pic?: string;
    default_publish_status?: boolean;
}

export interface IDevToUserOutput {
    error: string;
    status: 401 | 422;
    username: string;
    profile_image: string;
}

export interface IDevToCreatePostInput {
    title: string;
    body_markdown?: string;
    published: boolean;
    main_image?: string;
    canonical_url?: string;
    description?: string;
    tags?: string[];
}

export interface IDevToCreatePostOutput {
    error: string;
    status: 401 | 422;
    title: string;
    description: string;
    body_markdown: string;
    url: string;
    cover_image: string;
    tags: string[];
}
