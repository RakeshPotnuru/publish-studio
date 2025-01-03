import mongoose, { Schema } from "mongoose";
import { fieldEncryption } from "mongoose-field-encryption";

import { GhostStatus, Platform } from "../../../config/constants";
import type { IGhost } from "./ghost.types";

const GhostSchema = new Schema<IGhost>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    api_url: { type: String, required: true, unique: true },
    admin_api_key: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: GhostStatus,
      required: true,
      default: GhostStatus.DRAFT,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

GhostSchema.plugin(fieldEncryption, {
  fields: ["admin_api_key"],
  secret: process.env.DB_ENCRYPTION_SECRET,
  encryptNull: false,
});

export default mongoose.model(Platform.GHOST, GhostSchema);
