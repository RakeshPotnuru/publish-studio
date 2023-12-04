import type { constants } from "../config/constants";

export interface IFile {
    originalname: string;
    mimetype: (typeof constants.asset.ALLOWED_MIMETYPES)[keyof typeof constants.asset.ALLOWED_MIMETYPES];
    size: number;
}
