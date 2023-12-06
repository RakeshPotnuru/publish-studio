import type { Types } from "mongoose";

import type { IPagination } from "../../types/common.types";

export interface IFolder {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    name: string;
    projects?: Types.ObjectId[];
}

export interface IFolderResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    name: string;
    projects?: Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
}

export interface IFoldersResponse {
    folders: IFolderResponse[];
    pagination: IPagination;
}
