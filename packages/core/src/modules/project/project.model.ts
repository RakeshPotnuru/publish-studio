import mongoose, { Schema } from "mongoose";

import { constants } from "../../constants";
import type { IProject } from "./project.types";

const ProjectSchema = new Schema<IProject>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        folder_id: { type: Schema.Types.ObjectId },
        title: {
            type: String,
            required: true,
            minlength: constants.project.title.MIN_LENGTH,
            maxlength: constants.project.title.MAX_LENGTH,
        },
        description: { type: String, maxlength: constants.project.description.MAX_LENGTH },
        body: { type: String, maxlength: constants.project.body.MAX_LENGTH },
        status: {
            type: String,
            enum: constants.project.status,
            required: true,
            default: constants.project.status.DRAFT,
        },
        cover_image: String,
        assets: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
        platforms: [
            {
                name: { type: String, enum: constants.user.platforms, required: true },
                status: { type: String, enum: ["success", "error"] },
                published_url: String,
                id: String,
            },
        ],
        scheduled_at: {
            type: Date,
            required: true,
            default: Date.now,
            validate: [
                {
                    validator: function (value: Date) {
                        const currentDate = new Date();
                        return value >= currentDate;
                    },
                    message: "Scheduled date must be in the future.",
                },
                {
                    validator: function (value: Date) {
                        const maxDate = new Date();
                        maxDate.setDate(maxDate.getDate() + 30);
                        return value <= maxDate;
                    },
                    message: "Scheduled date must be within 30 days from now.",
                },
            ],
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
