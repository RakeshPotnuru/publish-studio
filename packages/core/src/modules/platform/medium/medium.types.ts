import type { Types } from "mongoose";

import type { MediumStatus } from "../../../config/constants";

export interface IMedium {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_key: string;
    username: string;
    author_id: string;
    status: MediumStatus;
    notify_followers: boolean;
    created_at: Date;
    updated_at: Date;
}

export type TMediumCreateInput = Omit<IMedium, "_id" | "created_at" | "updated_at">;

export type TMediumToUpdateInput = Partial<TMediumCreateInput>;

export type IMediumUserOutput =
    | {
          errors: null;
          id: string;
          username: string;
          image_url: string;
          url: string;
      }
    | {
          errors: {
              message: string;
              code: 6003 | 6000;
          }[];
      };

export interface IMediumCreatePostInput {
    title: string;
    contentFormat: "html" | "markdown";
    content?: string;
    tags?: string[];
    canonicalUrl?: string;
    publishStatus?: MediumStatus;
    notifyFollowers?: boolean;
}

interface IOutput {
    isError: boolean;
    data?: {
        url: string;
        id: string;
    };
}

export type TMediumCreatePostOutput = IOutput extends { isError: false }
    ? { url: string; id: string }
    : IOutput;
