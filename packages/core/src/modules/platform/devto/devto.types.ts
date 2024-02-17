import type { Types } from "mongoose";

export interface IDevTo {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  api_key: string;
  username: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export type TDevToCreateInput = Omit<
  IDevTo,
  "_id" | "created_at" | "updated_at"
>;

export type TDevToUpdateInput = Partial<TDevToCreateInput>;

export interface IDevToUserOutput {
  username: string;
  profile_image: string;
}

export interface IDevToCreatePostInput {
  title: string;
  body_markdown?: string;
  published: boolean;
  main_image?: string;
  canonical_url?: string;
  description?: string;
  tags?: string[];
}

export type IDevToUpdatePost = Partial<IDevToCreatePostInput>;

interface IOutput {
  isError: boolean;
  id?: number;
  url?: string;
}

export type TDevToCreatePostOutput = IOutput extends { isError: false }
  ? { id: number; url: string }
  : IOutput;

export interface IDevToUpdatePostOutput {
  isError: boolean;
}

export interface IDevToGetAllPostsOutput {
  id: number;
  title: string;
  description: string;
  published: boolean;
  published_at: string;
  url: string;
  body_markdown: string;
  cover_image?: string;
  tag_list: string[];
  canonical_url: string;
}
