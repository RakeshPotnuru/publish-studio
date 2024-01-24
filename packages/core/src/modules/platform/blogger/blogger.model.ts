import mongoose, { Schema } from "mongoose";
import { fieldEncryption } from "mongoose-field-encryption";

import { constants } from "../../../config/constants";
import type { IBlogger } from "./blogger.types";

const BloggerSchema = new Schema<IBlogger>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        blog_id: { type: String, required: true, unique: true },
        blog_url: { type: String, required: true, unique: true },
        token: { type: String, required: true, unique: true },
        status: { type: Boolean, required: true, default: true },
    },

    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

BloggerSchema.plugin(fieldEncryption, {
    fields: ["token"],
    secret: process.env.ENCRYPTION_SECRET,
    encryptNull: false,
});

export default mongoose.model(constants.user.platforms.BLOGGER, BloggerSchema);
