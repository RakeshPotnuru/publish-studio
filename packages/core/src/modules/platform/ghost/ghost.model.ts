import { TRPCError } from "@trpc/server";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

import { encryptField } from "../../../utils/aws/kms";
import type { IGhost } from "./ghost.types";

const GhostSchema = new Schema<IGhost>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        api_url: { type: String, required: true, unique: true },
        admin_api_key: { type: String, required: true, unique: true },
        ghost_version: { type: String, required: true },
        default_publish_status: { type: String, required: true, default: "draft" },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

type TGhostDocument = IGhost & Document;

/* The code `GhostSchema.pre<TGhostDocument>("save", async function (next) { ... })` is a pre-save
middleware to encrypt "admin_api_key" before saving. */
GhostSchema.pre<TGhostDocument>("save", async function (next) {
    if (this.isModified("admin_api_key")) {
        try {
            const encryptedAdminApiKey = await encryptField(this.admin_api_key);
            this.admin_api_key = encryptedAdminApiKey;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while encrypting the admin API key.",
            });
        }
    }
    next();
});

export default mongoose.model("Ghost", GhostSchema);
