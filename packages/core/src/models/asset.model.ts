import mongoose, { Schema } from "mongoose";

interface IAsset {
    original_file_name: string;
    imgur_link: string;
}

const AssetSchema = new Schema<IAsset>(
    {
        original_file_name: { type: String, required: true },
        imgur_link: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("Asset", AssetSchema);
