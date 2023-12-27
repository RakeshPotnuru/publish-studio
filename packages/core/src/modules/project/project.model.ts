import mongoose, { Schema } from "mongoose";

import { constants } from "../../config/constants";
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
        body: {
            json: { type: Object },
            html: { type: String },
            markdown: { type: String },
        },
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
                status: { type: String, enum: constants.project.platformPublishStatuses },
                published_url: String,
                id: String,
            },
        ],
        tags: {
            hashnode_tags: [
                {
                    name: { type: String },
                    id: { type: String },
                },
            ],
            devto_tags: [{ type: String }],
            medium_tags: [{ type: String }],
            ghost_tags: [
                {
                    name: { type: String },
                },
            ],
        },
        canonical_url: String,
        tone_analysis: {
            sentiment: {
                type: String,
                enum: constants.project.tone_analysis.sentiments,
            },
            emotion: {
                sadness: Number,
                joy: Number,
                fear: Number,
                disgust: Number,
                anger: Number,
            },
        },
        scheduled_at: {
            type: Date,
        },
        published_at: {
            type: Date,
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
