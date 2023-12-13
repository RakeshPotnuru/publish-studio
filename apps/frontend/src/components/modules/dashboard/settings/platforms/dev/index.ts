import type { Types } from "mongoose";

export interface IDevToResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic: string;
    default_publish_status: boolean;
    created_at: Date;
    updated_at: Date;
}

export { DevConnectForm } from "./connect-form";
export { DevEditForm } from "./edit-form";
