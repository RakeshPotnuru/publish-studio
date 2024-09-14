import mongoose, { Schema } from "mongoose";

import { SnippetType } from "../../config/constants";
import type { ISnippet } from "./snippet.types";

const SnippetSchema = new Schema<ISnippet>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    body: { type: Object },
    link: { type: String },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    type: {
      type: String,
      enum: SnippetType,
      required: true,
      default: SnippetType.TEXT,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default mongoose.model("Snippet", SnippetSchema);
