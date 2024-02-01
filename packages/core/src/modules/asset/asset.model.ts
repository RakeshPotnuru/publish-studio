import mongoose, { Schema } from "mongoose";

import { MimeType } from "../../config/constants";
import type { IAsset } from "./asset.types";

const AssetSchema = new Schema<IAsset>(
    {
        original_file_name: { type: String, required: true },
        hosted_url: { type: String, required: true },
        project_id: { type: Schema.Types.ObjectId },
        user_id: { type: Schema.Types.ObjectId, required: true },
        size: { type: Number, required: true },
        mimetype: { type: String, enum: MimeType, required: true },
        key: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("Asset", AssetSchema);
