import type { Types } from "mongoose";

export interface IFolder {
    user_id?: Types.ObjectId;
    name: string;
    projects?: Types.ObjectId[];
}
