import mongoose, { Schema } from "mongoose";

import {
  constants,
  Platform,
  ProjectStatus,
  Sentiment,
} from "../../config/constants";
import type { IProject } from "./project.types";

const ProjectSchema = new Schema<IProject>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    folder_id: { type: Schema.Types.ObjectId },
    name: {
      type: String,
      required: true,
      minlength: constants.project.name.MIN_LENGTH,
      maxlength: constants.project.name.MAX_LENGTH,
    },
    title: {
      type: String,
      minlength: constants.project.title.MIN_LENGTH,
      maxlength: constants.project.title.MAX_LENGTH,
    },
    description: {
      type: String,
      maxlength: constants.project.description.MAX_LENGTH,
    },
    body: {
      json: { type: Object },
      html: { type: String },
      markdown: { type: String },
    },
    status: {
      type: String,
      enum: ProjectStatus,
      required: true,
      default: ProjectStatus.DRAFT,
    },
    cover_image: String,
    platforms: {
      type: [String],
      enum: Platform,
    },
    tags: {
      // hashnode_tags: [
      //     {
      //         name: { type: String },
      //         id: { type: String },
      //     },
      // ],
      devto_tags: [{ type: String }],
      medium_tags: [{ type: String }],
      ghost_tags: [
        {
          name: { type: String },
        },
      ],
      wordpress_tags: [{ type: String }],
      blogger_tags: [{ type: String }],
    },
    canonical_url: String,
    tone_analysis: {
      sentiment: {
        type: String,
        enum: Sentiment,
      },
      emotion: {
        sadness: Number,
        joy: Number,
        fear: Number,
        disgust: Number,
        anger: Number,
      },
    },
    categories: [{ type: String }],
    scheduled_at: {
      type: Date,
    },
    published_at: {
      type: Date,
    },
    stats: {
      readingTime: { type: Number, default: 0 },
      wordCount: { type: Number, default: 0 },
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
