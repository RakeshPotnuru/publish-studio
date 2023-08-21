import mongoose, { Schema } from "mongoose";

import { folder } from "../../constants";
import type { IFolder } from "./folder.types";

const FolderSchema = new Schema<IFolder>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: folder.name.MIN_LENGTH,
            maxlength: folder.name.MAX_LENGTH,
        },
        projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("Folder", FolderSchema);
