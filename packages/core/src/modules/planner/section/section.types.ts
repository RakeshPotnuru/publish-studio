import type { Types } from "mongoose";

import type { ITask } from "../task/task.types";

export interface ISection {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  name: string;
  tasks?: Types.ObjectId[];
  order: number;
  created_at: Date;
  updated_at: Date;
}

export type TSectionCreateInput = Omit<
  ISection,
  "_id" | "created_at" | "updated_at"
>;

export type TSectionUpdateInput = Partial<
  Omit<ISection, "user_id" | "created_at" | "updated_at">
>;

export type TSectionResponse = Omit<ISection, "tasks"> & {
  tasks?: ITask[];
};
