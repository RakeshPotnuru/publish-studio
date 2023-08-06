import type { Types } from "mongoose";

export interface IDevTo {
    user_id?: Types.ObjectId;
    api_key: string;
    username?: string;
    profile_pic?: string;
}

export interface IDevToUserOutput {
    error: string;
    status: 401 | 422;
    data: {
        username: string;
        profile_image: string;
    };
}

export interface IDevToCreatePostInput {
    project_id: Types.ObjectId;
    title: string;
    body_markdown: string;
    published?: boolean;
    main_image?: string;
    canonical_url?: string;
    description: string;
    tags?: string[];
}

export interface IDevToCreatePostOutput {
    error: string;
    status: 401 | 422;
    article: {
        title: string;
        description: string;
        body_markdown: string;
        url: string;
        cover_image: string;
        tags: string[];
    };
}
