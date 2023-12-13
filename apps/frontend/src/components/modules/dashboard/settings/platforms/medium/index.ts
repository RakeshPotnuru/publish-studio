import { Types } from "mongoose";

export type TMediumStatus = "public" | "draft" | "unlisted";

export interface IMediumResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic: string;
    author_id: string;
    default_publish_status: TMediumStatus;
    notify_followers: boolean;
    created_at: Date;
    updated_at: Date;
}

export { MediumConnectForm } from "./connect-form";
export { MediumEditForm } from "./edit-form";
