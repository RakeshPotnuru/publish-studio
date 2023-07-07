import type { Types } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface IFolder {
    user_id: Types.ObjectId;
    name: string;
}

const FolderSchema = new Schema<IFolder>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true, unique: true, minlength: 3, maxlength: 120 },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("Folder", FolderSchema);
