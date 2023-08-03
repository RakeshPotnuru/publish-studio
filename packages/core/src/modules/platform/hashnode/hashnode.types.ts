import type { Types } from "mongoose";

export interface IHashnode {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic?: string;
    blog_handle?: string;
    publication: {
        publication_id: string;
        publication_logo?: string;
    };
}

export interface IHashnodeUser {
    photo: string;
    blogHandle: string;
    publication: {
        _id: string;
        favicon: string;
    };
}

export interface IHashnodeCreateStoryInput {
    project_id: Types.ObjectId;
    title: string;
    isPartOfPublication: {
        publicationId: string;
    };
    contentMarkdown: string;
    coverImageURL?: string;
    isRepublished?: {
        originalArticleURL: string;
    };
    tags?: {
        _id: string;
        name: string;
        slug: string;
    }[];
}

export interface IHashnodeCreatePostOutput {
    errors: {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
        extensions: {
            code: "UNAUTHENTICATED" | "INTERNAL_SERVER_ERROR";
        };
    };
    code: number;
    success: boolean;
    message: string;
    post: {
        title: string;
        contentMarkdown: string;
        tags: { name: string }[];
        slug: string;
        coverImage: string;
        brief: string;
        blogHandle: string;
    };
}
