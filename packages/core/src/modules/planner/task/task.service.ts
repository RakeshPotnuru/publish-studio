import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { logtail } from "../../../utils/logtail";
import Section from "../section/section.model";
import SectionService from "../section/section.service";
import type { TSectionResponse } from "../section/section.types";
import Task from "./task.model";
import type { ITask, TTaskCreateInput, TTaskUpdateInput } from "./task.types";

export default class TaskService extends SectionService {
  async createTask(task: TTaskCreateInput): Promise<ITask> {
    try {
      const newTask = await Task.create(task);

      await Section.findByIdAndUpdate(task.section_id, {
        $push: { tasks: newTask._id },
      }).exec();

      return newTask;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: task.user_id,
      });
      console.log("error", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while creating the task. Please try again later.",
      });
    }
  }

  async getTaskById(
    id: Types.ObjectId,
    user_id: Types.ObjectId,
  ): Promise<ITask | null> {
    try {
      return await Task.findOne({ user_id, _id: id }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the task. Please try again later.",
      });
    }
  }

  async getTasksBySectionId(
    section_id: Types.ObjectId,
    user_id: Types.ObjectId,
  ): Promise<ITask[]> {
    try {
      return await Task.find({ user_id, section_id }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the tasks. Please try again later.",
      });
    }
  }

  async updateTask(
    id: Types.ObjectId,
    user_id: Types.ObjectId,
    task: TTaskUpdateInput,
  ): Promise<ITask | null> {
    try {
      return await Task.findOneAndUpdate(
        { user_id, _id: id },
        {
          $set: {
            ...task,
            start_date: task.start_date,
            due_date: task.due_date,
          },
        },
        { new: true },
      ).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while updating the task. Please try again later.",
      });
    }
  }

  async deleteTasks(
    ids: Types.ObjectId[],
    user_id: Types.ObjectId,
  ): Promise<void> {
    try {
      await Section.updateMany(
        { user_id, tasks: { $in: ids } },
        { $pull: { tasks: { $in: ids } } },
      ).exec();

      await Task.deleteMany({ user_id, _id: { $in: ids } }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while deleting the tasks. Please try again later.",
      });
    }
  }

  async getTasksLength(
    user_id: Types.ObjectId,
    section_id: Types.ObjectId,
  ): Promise<number> {
    try {
      return await Task.find({ user_id, section_id }).countDocuments().exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the tasks. Please try again later.",
      });
    }
  }

  async reorderTasks(
    sections: TSectionResponse[],
    user_id: Types.ObjectId,
  ): Promise<void> {
    try {
      for (const section of sections) {
        const { _id, tasks } = section;

        // Update the section
        await Section.findOneAndUpdate(
          { _id, user_id },
          {
            $set: { tasks: tasks?.map((task) => task._id) },
          },
        );

        // Update tasks
        if (tasks && tasks.length > 0) {
          const updatePromises = tasks.map((task: ITask) =>
            Task.findOneAndUpdate(
              { _id: task._id, user_id },
              {
                $set: {
                  order: task.order,
                  section_id: _id,
                },
              },
            ),
          );

          await Promise.all(updatePromises);
        }
      }
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });
      console.log("error", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while updating the tasks. Please try again later.",
      });
    }
  }
}
