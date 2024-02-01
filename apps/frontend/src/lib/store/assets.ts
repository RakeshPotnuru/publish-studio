import type { Types } from "mongoose";

export interface IAsset {
    _id: Types.ObjectId;
    name: string;
    url: string;
    size: number;
    mime_type: string;
    created: Date;
}
