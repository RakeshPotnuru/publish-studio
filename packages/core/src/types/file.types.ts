import type { MimeType } from "../config/constants";

export interface IFile {
  originalname: string;
  mimetype: MimeType;
  size: number;
}
