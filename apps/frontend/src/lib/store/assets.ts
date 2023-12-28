import { constants } from "@/config/constants";
import type { Types } from "mongoose";

export type TMimeType =
    (typeof constants.asset.ALLOWED_MIMETYPES)[keyof typeof constants.asset.ALLOWED_MIMETYPES];

export interface IAsset {
    _id: Types.ObjectId;
    name: string;
    url: string;
    size: number;
    mime_type: string;
    created: Date;
}
