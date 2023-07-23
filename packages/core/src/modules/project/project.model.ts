import mongoose, { Schema } from "mongoose";

import type { IProject } from "./project.types";

const ProjectSchema = new Schema<IProject>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        folder_id: { type: Schema.Types.ObjectId },
        title: { type: String, required: true, minlength: 3, maxlength: 120 },
        description: { type: String, maxlength: 500 },
        body: { type: String, maxlength: 100_000 },
        tags: [{ type: String, maxlength: 50 }],
        status: { type: String, enum: ["draft", "published"], required: true, default: "draft" },
        cover_image: String,
        assets: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("Project", ProjectSchema);
