import mongoose, { Schema } from "mongoose";
import { fieldEncryption } from "mongoose-field-encryption";

import { constants } from "../../../config/constants";
import type { IWordPress } from "./wordpress.types";

const WordPressSchema = new Schema<IWordPress>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        blog_url: { type: String, required: true, unique: true },
        blog_id: { type: String, required: true, unique: true },
        token: { type: String, required: true, unique: true },
        publicize: { type: Boolean, required: true, default: false },
        status: {
            type: String,
            enum: constants.wordpressStatuses,
            required: true,
            default: constants.wordpressStatuses.DRAFT,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

WordPressSchema.plugin(fieldEncryption, {
    fields: ["token"],
    secret: process.env.ENCRYPTION_SECRET,
    encryptNull: false,
});

export default mongoose.model(constants.user.platforms.WORDPRESS, WordPressSchema);
