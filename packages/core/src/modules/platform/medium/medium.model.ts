import mongoose, { Schema } from "mongoose";

import type { IMedium } from "./medium.types";

const MediumSchema = new Schema<IMedium>({
    user_id: { type: Schema.Types.ObjectId, required: true },
    api_key: { type: String, required: true },
    username: { type: String },
    profile_pic: { type: String },
    author_id: { type: String, required: true },
});

export default mongoose.model("Medium", MediumSchema);
