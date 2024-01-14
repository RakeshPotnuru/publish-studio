import type { Types } from "mongoose";

export interface IHashnodeDefaultSettings {
    enable_table_of_contents: boolean;
    send_newsletter: boolean;
    delisted: boolean;
}

export interface IHashnode {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic?: string;
    blog_handle: string;
    publication: {
        publication_id: string;
        publication_logo?: string;
    };
    settings: IHashnodeDefaultSettings;
}

export interface IHashnodeResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic?: string;
    blog_handle: string;
    publication: {
        publication_id: string;
        publication_logo?: string;
    };
    settings: IHashnodeDefaultSettings;
    created_at: Date;
    updated_at: Date;
}

export interface IHashnodeUserOutput {
    data: {
        me: {
            id: string;
            username: string;
            profilePicture: string;
            publications: {
                edges: {
                    node: {
                        id: string;
                        url: string;
                        favicon: string;
                    };
                }[];
                totalDocuments: number;
            };
        };
    } | null;
    errors: {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
        path: string[];
        extensions: {
            code:
                | "GRAPHQL_VALIDATION_FAILED"
                | "UNAUTHENTICATED"
                | "FORBIDDEN"
                | "BAD_USER_INPUT"
                | "NOT_FOUND";
        };
    }[];
}

export interface IHashnodeCreateStoryInput {
    title: string;
    publicationId: string;
    contentMarkdown: string;
    coverImageOptions?: {
        coverImageURL?: string;
    };
    originalArticleURL?: string;
    tags: { id: string; name: string }[];
    settings: {
        enableTableOfContent: boolean;
        isNewsletterActivated: boolean;
        delisted: boolean;
    };
}

export interface IOutput {
    isError: boolean;
    data?: {
        publishPost: { post: { id: string; slug: string } };
    };
}

export type THashnodeCreatePostOutput = IOutput extends { isError: false }
    ? { id: string; url: string }
    : IOutput;

export interface IHashnodeUpdatePostOutput {
    isError: boolean;
}
