import mongoose, { Schema } from "mongoose";
import { fieldEncryption } from "mongoose-field-encryption";

import { MediumStatus, Platform } from "../../../config/constants";
import type { IMedium } from "./medium.types";

const MediumSchema = new Schema<IMedium>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        api_key: { type: String, required: true, unique: true },
        username: { type: String, unique: true },
        author_id: { type: String, required: true },
        status: {
            type: String,
            enum: MediumStatus,
            required: true,
            default: MediumStatus.DRAFT,
        },
        notify_followers: { type: Boolean, required: true, default: false },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

MediumSchema.plugin(fieldEncryption, {
    fields: ["api_key"],
    secret: process.env.DB_ENCRYPTION_SECRET,
    encryptNull: false,
});

export default mongoose.model(Platform.MEDIUM, MediumSchema);
