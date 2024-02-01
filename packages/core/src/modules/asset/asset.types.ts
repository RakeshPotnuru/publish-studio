import type { Types } from "mongoose";

import type { MimeType } from "../../config/constants";
import type { IPagination } from "../../types/common.types";

export interface IAsset {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    project_id?: Types.ObjectId;
    original_file_name: string;
    hosted_url: string;
    size: number;
    mimetype: MimeType;
    key: string;
    created_at: Date;
    updated_at: Date;
}

export interface IAssetsResponse {
    assets: IAsset[];
    pagination: IPagination;
}
