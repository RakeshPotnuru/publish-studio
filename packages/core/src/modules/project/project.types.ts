import type { Types } from "mongoose";

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
}
