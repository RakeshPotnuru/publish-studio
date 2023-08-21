import type { Types } from "mongoose";

import type { user } from "../../constants";

export interface IProject {
    user_id?: Types.ObjectId;
    folder_id?: Types.ObjectId;
    title: string;
    description?: string;
    body?: string;
    tags?: string[];
    status: "draft" | "published";
    cover_image?: string;
    assets?: Types.ObjectId[];
    platforms?: {
        name: (typeof user.platforms)[keyof typeof user.platforms];
        status?: "success" | "error";
        published_url?: string;
    }[];
    canonical_url?: string;
    scheduled_at: Date;
}

export type IProjectUpdate = Partial<IProject>;

export type hashnode_tags = {
    name: string;
    slug: string;
    _id: string;
}[];
