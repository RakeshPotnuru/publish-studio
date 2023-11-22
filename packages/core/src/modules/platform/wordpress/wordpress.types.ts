import type { Types } from "mongoose";

export type TWordPressStatus = "published" | "draft";

export interface IWordPress {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    site_url: string;
    username: string;
    password: string;
    default_publish_status: TWordPressStatus;
}

export type TWordPressUpdate =
    | IWordPress
    | {
          site_url: string;
          username: string;
          password?: string;
          default_publish_status: TWordPressStatus;
      };
