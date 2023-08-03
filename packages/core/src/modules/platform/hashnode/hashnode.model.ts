import mongoose, { Schema } from "mongoose";

import type { IHashnode } from "./hashnode.types";

const HashnodeSchema = new Schema<IHashnode>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        api_key: { type: String, required: true },
        username: { type: String, required: true },
        profile_pic: { type: String },
        blog_handle: { type: String },
        publication: {
            publication_id: { type: String, required: true },
            publication_logo: { type: String },
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("Hashnode", HashnodeSchema);
