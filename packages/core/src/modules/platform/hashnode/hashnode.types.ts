import type { Types } from "mongoose";

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
        publication: {
            domain: string;
        };
    };
}

export interface IHashnodeProfile {
    username: string;
    photo: string;
    publication: {
        _id: string;
        logo: string;
        domain: string;
    };
}
