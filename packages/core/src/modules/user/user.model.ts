import mongoose, { Schema } from "mongoose";

import { user } from "../../constants";
import type { IUser } from "./user.types";

const UserSchema = new Schema<IUser>(
    {
        first_name: {
            type: String,
            required: true,
            minlength: user.firstName.MIN_LENGTH,
            maxlength: user.firstName.MAX_LENGTH,
        },
        last_name: {
            type: String,
            required: true,
            minlength: user.lastName.MIN_LENGTH,
            maxlength: user.lastName.MAX_LENGTH,
        },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, minlength: user.password.MIN_LENGTH },
        profile_pic: String,
        user_type: {
            type: String,
            enum: user.userTypes,
            required: true,
            default: user.userTypes.FREE,
        },
        projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
        assets: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
        platforms: [{ type: String, enum: user.platforms }],
        is_verified: { type: Boolean, required: true, default: false },
        last_login: { type: Date, required: true, default: Date.now },
        auth_modes: {
            type: [String],
            enum: user.authModes,
            required: true,
            default: [user.authModes.CLASSIC],
        },
        google_sub: String,
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("User", UserSchema);
