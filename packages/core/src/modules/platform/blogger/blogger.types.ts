import type { Types } from "mongoose";

export interface IBlogger {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    blog_id: string;
    blog_url: string;
    token: string;
}

export interface IBloggerResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    blog_id: string;
    blog_url: string;
    token: string;
    created_at: Date;
    updated_at: Date;
}

export interface IBloggerCreatePostInput {
    title: string;
    content?: string;
    labels?: string[];
    status: string;
}

export type IBloggerUpdatePost = Partial<IBloggerCreatePostInput>;

export interface IOutput {
    isError: boolean;
    id?: string;
    url?: string;
}

export type IBloggerCreatePostOutput = IOutput extends { isError: false }
    ? { id: string; url: string }
    : IOutput;

export interface IBloggerUpdatePostOutput {
    isError: boolean;
}
