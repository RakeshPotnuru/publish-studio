import type { Types } from "mongoose";

export interface IAsset {
    original_file_name: string;
    hosted_url: string;
    project_id?: Types.ObjectId;
    user_id: Types.ObjectId;
}
