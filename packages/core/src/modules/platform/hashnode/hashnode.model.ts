import mongoose, { Schema } from "mongoose";
import { fieldEncryption } from "mongoose-field-encryption";

import { Platform } from "../../../config/constants";
import type { IHashnode } from "./hashnode.types";

const HashnodeSchema = new Schema<IHashnode>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        api_key: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        blog_handle: { type: String },
        publication: {
            publication_id: { type: String, required: true },
        },
        settings: {
            enable_table_of_contents: { type: Boolean, required: true, default: false },
            send_newsletter: { type: Boolean, required: true, default: false },
            delisted: { type: Boolean, required: true, default: false },
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

HashnodeSchema.plugin(fieldEncryption, {
    fields: ["api_key"],
    secret: process.env.DB_ENCRYPTION_SECRET,
    encryptNull: false,
});

export default mongoose.model(Platform.HASHNODE, HashnodeSchema);
