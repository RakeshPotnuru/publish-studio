import type { Types } from "mongoose";

import type { SnippetType } from "../../config/constants";
import type { IPagination } from "../../types/common.types";

export interface ISnippet {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  body?: JSON;
  link?: string;
  type: SnippetType;
  context?: string;
  projects?: Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

export interface ISnippetsResponse {
  snippets: ISnippet[];
  pagination: IPagination;
}

export type TSnippetCreateInput = Omit<
  ISnippet,
  "_id" | "created_at" | "updated_at"
>;

export type TSnippetUpdateInput = Pick<ISnippet, "body" | "context">;
