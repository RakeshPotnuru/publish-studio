import mongoose, { Schema } from "mongoose";

import {
  AuthMode,
  constants,
  Platform,
  UserType,
} from "../../config/constants";
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
      enum: UserType,
      required: true,
      default: UserType.FREE,
    },
    platforms: [{ type: String, enum: Platform }],
    is_verified: { type: Boolean, required: true, default: false },
    last_login: { type: Date, required: true, default: Date.now },
    auth_modes: {
      type: [String],
      enum: AuthMode,
      required: true,
      default: [AuthMode.CLASSIC],
    },
    google_sub: String,
    customer_id: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export default mongoose.model("User", UserSchema);
