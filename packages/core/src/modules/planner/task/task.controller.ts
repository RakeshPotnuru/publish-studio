import type { Types } from "mongoose";

import type { Context } from "../../../trpc";
import type { TSectionResponse } from "../section/section.types";
import TaskService from "./task.service";
import type { TTaskCreateInput, TTaskUpdateInput } from "./task.types";

export default class TaskController extends TaskService {
  async createTaskHandler(
    task: Omit<TTaskCreateInput, "user_id" | "order">,
    ctx: Context,
  ) {
    const tasksLength = await super.getTasksLength(
      ctx.user._id,
      task.section_id,
    );

    return super.createTask({
      ...task,
      user_id: ctx.user._id,
      order: tasksLength,
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
    return await super.deleteTasks(ids, ctx.user._id);
  }

  async reorderTasksHandler(sections: TSectionResponse[], ctx: Context) {
    return super.reorderTasks(sections, ctx.user._id);
  }
}
