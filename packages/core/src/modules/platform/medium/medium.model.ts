import mongoose, { Schema } from "mongoose";

import type { IMedium } from "./medium.types";

const MediumSchema = new Schema<IMedium>({
    user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    api_key: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    profile_pic: { type: String },
    author_id: { type: String, required: true },
});

export default mongoose.model("Medium", MediumSchema);
