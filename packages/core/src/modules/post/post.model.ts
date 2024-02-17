import mongoose, { Schema } from "mongoose";

import { Platform, PostStatus } from "../../config/constants";

const PostSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    project_id: { type: Schema.Types.ObjectId, required: true },
    post_id: { type: String },
    platform: { type: String, enum: Platform, required: true },
    status: { type: String, enum: PostStatus },
    published_url: { type: String },
    published_at: { type: Date },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default mongoose.model("Post", PostSchema);
