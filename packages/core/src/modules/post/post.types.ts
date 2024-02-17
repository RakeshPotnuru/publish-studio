import type { Types } from "mongoose";

import type { Platform, PostStatus } from "../../config/constants";
import type { IProject } from "../project/project.types";

export interface IPost {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  project_id: Types.ObjectId;
  post_id?: string;
  platform: Platform;
  status?: PostStatus;
  published_url?: string;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export type TPostCreateInput = Omit<IPost, "_id" | "created_at" | "updated_at">;

export type TPostUpdateInput = Partial<TPostCreateInput>;

export interface IPublish {
  platforms: Platform[];
  project_id: Types.ObjectId;
  scheduled_at?: Date;
  user_id: Types.ObjectId;
}

export interface ISchedule {
  platforms: Platform[];
  project: IProject;
  scheduled_at: Date;
  user_id: Types.ObjectId;
}

export type TEdit = Omit<IPublish, "scheduled_at">;
