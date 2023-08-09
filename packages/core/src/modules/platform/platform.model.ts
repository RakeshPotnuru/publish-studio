import mongoose, { Schema } from "mongoose";

import { user } from "../../utils/constants";
import type { IPlatform } from "./platform.types";

const PlatformModel = new Schema<IPlatform>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
            enum: user.platforms,
        },
        data: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            refPath: "name",
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("Platform", PlatformModel);
