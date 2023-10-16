import type { Types } from "mongoose";

import type { constants } from "../../constants";

export interface IAsset {
    original_file_name: string;
    hosted_url: string;
    project_id?: Types.ObjectId;
    user_id: Types.ObjectId;
    size: number;
    mimetype: (typeof constants.asset.ALLOWED_MIMETYPES)[keyof typeof constants.asset.ALLOWED_MIMETYPES];
}
