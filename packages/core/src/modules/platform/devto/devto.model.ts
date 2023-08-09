import { TRPCError } from "@trpc/server";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

import { encryptField } from "../../../utils/aws/kms";
import type { IDevTo } from "./devto.types";

const DevToSchema = new Schema<IDevTo>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        api_key: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        profile_pic: { type: String },
        default_publish_status: { type: Boolean, required: true, default: false },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

type TDevToDocument = IDevTo & Document;

/* The code `DevToSchema.pre<TDevToDocument>("save", async function (next) { ... })` is a pre-save
middleware to encrypt "api_key" before saving. */
DevToSchema.pre<TDevToDocument>("save", async function (next) {
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

export default mongoose.model("DevTo", DevToSchema);
