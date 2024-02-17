import type { Types } from "mongoose";

export interface IBlogger {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  blog_id: string;
  blog_url: string;
  token: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export type TBloggerCreateInput = Omit<
  IBlogger,
  "_id" | "created_at" | "updated_at"
>;

export interface IBloggerUpdateInput {
  blog_id: string;
  blog_url: string;
  status: boolean;
}

export interface IBloggerCreatePostInput {
  blogId: string;
  isDraft: boolean;
  requestBody: {
    title: string;
    content?: string;
    labels?: string[];
  };
}

export type TBloggerUpdatePostInput = Partial<IBloggerCreatePostInput>;

export interface IBloggerUpdatePostOutput {
  isError: boolean;
}

export interface IBloggerGetAllPostsOutput {
  items?: {
    id: string;
    title: string;
    content: string;
    published: string;
    url: string;
    labels?: string[];
  }[];
  nextPageToken?: string;
}
