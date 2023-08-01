import mongoose, { Schema } from "mongoose";

import { project } from "../../utils/constants";
import type { IProject } from "./project.types";

const ProjectSchema = new Schema<IProject>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        folder_id: { type: Schema.Types.ObjectId },
        title: {
            type: String,
            required: true,
            minlength: project.title.MIN_LENGTH,
            maxlength: project.title.MAX_LENGTH,
        },
        description: { type: String, maxlength: project.description.MAX_LENGTH },
        body: { type: String, maxlength: project.body.MAX_LENGTH },
        tags: [{ type: String, maxlength: project.tags.MAX_LENGTH }],
        status: {
            type: String,
            enum: project.status,
            required: true,
            default: project.status.DRAFT,
        },
        cover_image: String,
        assets: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
        platform: {
            type: String,
            enum: project.platforms,
            required: true,
            default: project.platforms.DEFAULT,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("Project", ProjectSchema);
