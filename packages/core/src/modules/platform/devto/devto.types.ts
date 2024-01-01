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

export type TDevToUserUpdate = Partial<IDevTo>;

export interface IDevToUserOutput {
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

export interface IOutput {
    isError: boolean;
    id?: number;
    url?: string;
}

export type TDevToCreatePostOutput = IOutput extends { isError: false }
    ? { id: number; url: string }
    : IOutput;

export interface IDevToUpdatePostOutput {
    isError: boolean;
}
