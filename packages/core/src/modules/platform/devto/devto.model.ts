import mongoose, { Schema } from "mongoose";
import { fieldEncryption } from "mongoose-field-encryption";

import { Platform } from "../../../config/constants";
import type { IDevTo } from "./devto.types";

const DevToSchema = new Schema<IDevTo>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        api_key: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        status: { type: Boolean, required: true, default: false },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

DevToSchema.plugin(fieldEncryption, {
    fields: ["api_key"],
    secret: process.env.ENCRYPTION_SECRET,
    encryptNull: false,
});

export default mongoose.model(Platform.DEVTO, DevToSchema);
