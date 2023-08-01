import type { Types } from "mongoose";

import type { project } from "../../utils/constants";

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
    platform: (typeof project.platforms)[keyof typeof project.platforms];
    published_url?: string;
}
