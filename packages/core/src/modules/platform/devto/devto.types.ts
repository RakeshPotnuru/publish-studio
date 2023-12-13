import type { Types } from "mongoose";

export interface IDevTo {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    api_key: string;
    username?: string;
    profile_pic?: string;
    default_publish_status: boolean;
}

export interface IDevToResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic: string;
    default_publish_status: boolean;
    created_at: Date;
    updated_at: Date;
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

export type IDevToUpdatePost = Partial<IDevToCreatePostInput>;

export interface IDevToCreatePostOutput {
    error: string;
    status: 401 | 422;
    id: number;
    title: string;
    description: string;
    body_markdown: string;
    url: string;
    cover_image: string;
    tags: string[];
}

export interface IDevToUpdatePostOutput {
    error: string;
    status: 401 | 422 | 404;
    id: number;
    title: string;
    description: string;
    body_markdown: string;
    url: string;
    cover_image: string;
    tags: string[];
}
