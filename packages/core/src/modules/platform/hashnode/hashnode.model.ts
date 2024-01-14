import { TRPCError } from "@trpc/server";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

import { constants } from "../../../config/constants";
import { encryptField } from "../../../utils/aws/kms";
import type { IHashnode } from "./hashnode.types";

const HashnodeSchema = new Schema<IHashnode>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        api_key: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        profile_pic: { type: String },
        blog_handle: { type: String },
        publication: {
            publication_id: { type: String, required: true },
            publication_logo: { type: String },
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

type THashnodeDocument = IHashnode & Document;

/* The code `HashnodeSchema.pre<THashnodeDocument>("save", async function (next) { ... })` is a pre-save
middleware to encrypt "api_key" before saving. */
HashnodeSchema.pre<THashnodeDocument>("save", async function (next) {
    if (this.isModified("api_key")) {
        try {
            const encryptedApiKey = await encryptField(this.api_key);
            this.api_key = encryptedApiKey;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while encrypting the API key.",
            });
        }
    }
    next();
});

export default mongoose.model(constants.user.platforms.HASHNODE, HashnodeSchema);
