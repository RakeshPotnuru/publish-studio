import mongoose, { Schema } from "mongoose";

import { constants } from "../../../config/constants";
import type { ITask } from "./task.types";

const TaskSchema = new Schema<ITask>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    section_id: { type: Schema.Types.ObjectId, required: true },
    name: {
      type: String,
      required: true,
      minlength: constants.planner.section.task.name.MIN_LENGTH,
      maxlength: constants.planner.section.task.name.MAX_LENGTH,
    },
    description: {
      type: String,
      maxlength: constants.planner.section.task.description.MAX_LENGTH,
    },
    due_date: { type: Date },
    start_date: { type: Date },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default mongoose.model("Task", TaskSchema);
