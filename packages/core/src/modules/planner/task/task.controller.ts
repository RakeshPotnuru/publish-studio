import type { Types } from "mongoose";

import type { Context } from "../../../trpc";
import TaskService from "./task.service";
import type { TTaskCreateInput, TTaskUpdateInput } from "./task.types";

export default class TaskController extends TaskService {
  async createTaskHandler(
    task: Omit<TTaskCreateInput, "user_id">,
    ctx: Context,
  ) {
    return super.createTask({
      ...task,
      user_id: ctx.user._id,
    });
  }

  async updateTaskHandler(
    id: Types.ObjectId,
    task: TTaskUpdateInput,
    ctx: Context,
  ) {
    return super.updateTask(id, ctx.user._id, task);
  }

  async deleteTasksHandler(ids: Types.ObjectId[], ctx: Context) {
    return super.deleteTasks(ids, ctx.user._id);
  }
}
