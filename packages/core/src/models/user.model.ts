import mongoose, { Schema } from "mongoose";

interface IUser {
    name: string;
    email: string;
    password: string;
    profile_pic?: string;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 50 },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        profile_pic: { type: String },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("User", UserSchema);
