import mongoose, { Schema } from "mongoose";

interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    profile_pic?: string;
    user_type: "free" | "pro";
}

const UserSchema = new Schema<IUser>(
    {
        first_name: { type: String, required: true, minlength: 3, maxlength: 25 },
        last_name: { type: String, required: true, minlength: 3, maxlength: 25 },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        profile_pic: String,
        user_type: { type: String, enum: ["free", "pro"], required: true, default: "free" },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("User", UserSchema);
