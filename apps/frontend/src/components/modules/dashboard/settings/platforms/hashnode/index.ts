import { Types } from "mongoose";

export interface IHashnodeDefaultSettings {
    enable_table_of_contents: boolean;
    send_newsletter: boolean;
    delisted: boolean;
}

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
    default_settings: IHashnodeDefaultSettings;
    created_at: Date;
    updated_at: Date;
}

export { HashnodeConnectForm } from "./connect-form";
export { HashnodeEditForm } from "./edit-form";
