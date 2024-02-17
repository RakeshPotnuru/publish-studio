import type { Types } from "mongoose";

import type { IPagination } from "../../types/common.types";

export interface IFolder {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  name: string;
  projects?: Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

export interface IFoldersResponse {
  folders: IFolder[];
  pagination: IPagination;
}

export type TFolderCreateInput = Pick<IFolder, "name" | "user_id">;

export type TFolderUpdateInput = Pick<IFolder, "name">;
