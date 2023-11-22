import { TRPCError } from "@trpc/server";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

import { encryptField } from "../../../utils/aws/kms";
import type { IWordPress } from "./wordpress.types";

const WordPressSchema = new Schema<IWordPress>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        site_url: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        default_publish_status: { type: String, required: true, default: "draft" },
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
middleware to encrypt "password" before saving. */
WordPressSchema.pre<TWordPressDocument>("save", async function (next) {
    if (this.isModified("password")) {
        try {
            const encryptedPassword = await encryptField(this.password);
            this.password = encryptedPassword;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while encrypting the password.",
            });
        }
    }
    next();
});

export default mongoose.model("WordPress", WordPressSchema);
