import type { Types } from "mongoose";

export interface ITask {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  section_id: Types.ObjectId;
  name: string;
  order: number;
  description?: string;
  due_date?: Date;
  start_date?: Date;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export type TTaskCreateInput = Omit<ITask, "_id" | "created_at" | "updated_at">;

export type TTaskUpdateInput = Partial<
  Omit<ITask, "_id" | "user_id" | "created_at" | "updated_at">
>;
