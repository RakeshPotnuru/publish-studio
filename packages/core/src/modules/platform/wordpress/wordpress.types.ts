import type { Types } from "mongoose";

import type { constants } from "../../../config/constants";

export type TWordPressStatus =
    (typeof constants.wordpressStatuses)[keyof typeof constants.wordpressStatuses];

export interface IWordPress {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    blog_url: string;
    blog_id: string;
    token: string;
    publicize: boolean;
    default_publish_status: TWordPressStatus;
}

export interface IWordPressResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    blog_url: string;
    blog_id: string;
    publicize: boolean;
    default_publish_status: TWordPressStatus;
    created_at: Date;
    updated_at: Date;
}

export interface IWordPressUserUpdate {
    publicize: boolean;
    default_publish_status: TWordPressStatus;
}

export interface IWordPressCreatePostInput {
    title: string;
    content?: string;
    tags?: string[];
    status: TWordPressStatus;
    publicize: boolean;
    excerpt?: string;
}

export type IWordPressUpdatePost = Partial<IWordPressCreatePostInput>;

export interface IOutput {
    isError: boolean;
    ID?: number;
    URL?: string;
}

export type IWordPressCreatePostOutput = IOutput extends { isError: false }
    ? { ID: number; URL: string }
    : IOutput;

export interface IWordPressUpdatePostOutput {
    isError: boolean;
}
