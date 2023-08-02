import mongoose, { Schema } from "mongoose";

import type { IDevTo } from "./devto.types";

const DevToSchema = new Schema<IDevTo>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        api_key: { type: String, required: true },
        username: { type: String },
        profile_pic: { type: String },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("DevTo", DevToSchema);
