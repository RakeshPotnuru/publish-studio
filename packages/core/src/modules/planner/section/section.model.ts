import mongoose, { Schema } from "mongoose";

import { constants } from "../../../config/constants";
import type { ISection } from "./section.types";

const SectionSchema = new Schema<ISection>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    name: {
      type: String,
      required: true,
      minlength: constants.planner.section.name.MIN_LENGTH,
      maxlength: constants.planner.section.name.MAX_LENGTH,
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    order: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default mongoose.model("Section", SectionSchema);
