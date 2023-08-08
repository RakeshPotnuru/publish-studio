import type { Types } from "mongoose";

import type { user } from "../../utils/constants";

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
    platforms?: (typeof user.platforms)[keyof typeof user.platforms][];
    published_url?: string;
    canonical_url?: string;
}
