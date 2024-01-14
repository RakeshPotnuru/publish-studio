import { TRPCError } from "@trpc/server";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

import { constants } from "../../../config/constants";
import { encryptField } from "../../../utils/aws/kms";
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

type TWordPressDocument = IWordPress & Document;

/* The code `WordPressSchema.pre<TWordPressDocument>("save", async function (next) { ... })` is a pre-save
middleware to encrypt "token" before saving. */
WordPressSchema.pre<TWordPressDocument>("save", async function (next) {
    if (this.isModified("token")) {
        try {
            const encryptedToken = await encryptField(this.token);
            this.token = encryptedToken;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while encrypting the token.",
            });
        }
    }
    next();
});

export default mongoose.model(constants.user.platforms.WORDPRESS, WordPressSchema);
