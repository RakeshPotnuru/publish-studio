import mongoose, { Schema } from "mongoose";

import { constants } from "../../constants";
import type { IUser } from "./user.types";

const UserSchema = new Schema<IUser>(
    {
        first_name: {
            type: String,
            required: true,
            minlength: constants.user.firstName.MIN_LENGTH,
            maxlength: constants.user.firstName.MAX_LENGTH,
        },
        last_name: {
            type: String,
            required: true,
            minlength: constants.user.lastName.MIN_LENGTH,
            maxlength: constants.user.lastName.MAX_LENGTH,
        },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, minlength: constants.user.password.MIN_LENGTH },
        profile_pic: String,
        user_type: {
            type: String,
            enum: constants.user.userTypes,
            required: true,
            default: constants.user.userTypes.FREE,
        },
        projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
        assets: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
        platforms: [{ type: String, enum: constants.user.platforms }],
        is_verified: { type: Boolean, required: true, default: false },
        last_login: { type: Date, required: true, default: Date.now },
        auth_modes: {
            type: [String],
            enum: constants.user.authModes,
            required: true,
            default: [constants.user.authModes.CLASSIC],
        },
        google_sub: String,
        stripe_customer_id: String,
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("User", UserSchema);
