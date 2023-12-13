import { Types } from "mongoose";

export interface IHashnodeResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    profile_pic?: string;
    blog_handle?: string;
    publication: {
        publication_id: string;
        publication_logo?: string;
    };
    created_at: Date;
    updated_at: Date;
}

export { HashnodeConnectForm } from "./connect-form";
export { HashnodeEditForm } from "./edit-form";
