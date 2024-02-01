import type { Types } from "mongoose";

import type { WordPressStatus } from "../../../config/constants";

export interface IWordPress {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    token: string;
    blog_url: string;
    blog_id: string;
    publicize: boolean;
    status: WordPressStatus;
    created_at: Date;
    updated_at: Date;
}

export type TWordPressCreateInput = Omit<IWordPress, "_id" | "created_at" | "updated_at">;

export interface IWordPressUpdateInput {
    publicize: boolean;
    status: WordPressStatus;
}

export interface IWordPressSiteOutput {
    access_token: string;
    blog_id: string;
    blog_url: string;
    token_type: string;
}

export interface IWordPressCreatePostInput {
    blog_id: string;
    title: string;
    content?: string;
    tags?: string[];
    status: WordPressStatus;
    publicize: boolean;
    excerpt?: string;
}

export type IWordPressUpdatePostInput = Partial<IWordPressCreatePostInput> & {
    post_id: string;
    blog_id: string;
};

interface IOutput {
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

export interface IWordPressGetAllPostsOutput {
    ID: number;
    URL: string;
    title: string;
    excerpt: string;
    date: Date;
    content: string;
    status: WordPressStatus;
    tags?: Record<
        string,
        {
            name: string;
        }
    >;
    featured_image?: string;
}
