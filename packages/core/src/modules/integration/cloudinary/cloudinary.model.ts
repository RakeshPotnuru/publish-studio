import mongoose, { Schema } from "mongoose";
import { fieldEncryption } from "mongoose-field-encryption";

import type { ICloudinary } from "./cloudinary.types";

const CloudinarySchema = new Schema<ICloudinary>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    cloud_name: { type: String, required: true },
    api_key: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

CloudinarySchema.plugin(fieldEncryption, {
  fields: ["cloud_name", "api_key"],
  secret: process.env.DB_ENCRYPTION_SECRET,
  encryptNull: false,
});

export default mongoose.model("Cloudinary", CloudinarySchema);
