import type { Types } from "mongoose";

import type {
  Platform,
  ProjectStatus,
  Sentiment,
} from "../../config/constants";
import type { IPagination } from "../../types/common.types";
import type { IEmotionScores } from "../nlu/nlu.types";

export interface IProject {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  folder_id?: Types.ObjectId;
  name: string;
  title?: string;
  description?: string;
  body?: {
    json?: JSON;
    html?: string;
    markdown?: string;
  };
  status: ProjectStatus;
  cover_image?: string;
  platforms?: Platform[];
  tags?: ITags;
  canonical_url?: string;
  tone_analysis?: {
    sentiment?: Sentiment;
    emotion?: IEmotionScores;
  };
  categories?: string[];
  scheduled_at?: Date;
  published_at?: Date;
  stats?: {
    readingTime?: number;
    wordCount?: number;
  };
  snippets?: Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

export interface IProjectsResponse {
  projects: IProject[];
  pagination: IPagination;
}

export type TProjectCreateInput = Omit<
  IProject,
  "_id" | "created_at" | "updated_at"
>;

export type IProjectUpdateInput = Partial<TProjectCreateInput>;

export type TProjectCreateFormInput = Omit<
  TProjectCreateInput,
  "user_id" | "scheduled_at" | "tone_analysis" | "topics"
>;

export interface IHashnodeTag {
  name: string;
  id: string;
}

export interface ITags {
  // hashnode_tags?: IHashnodeTag[];
  devto_tags?: string[];
  medium_tags?: string[];
  ghost_tags?: { name: string; _id?: Types.ObjectId }[];
  wordpress_tags?: string[];
  blogger_tags?: string[];
}
