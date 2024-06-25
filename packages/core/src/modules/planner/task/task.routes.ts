import type { Types } from "mongoose";
import { z } from "zod";

import { constants } from "../../../config/constants";
import { protectedProcedure, router } from "../../../trpc";
import type { TSectionResponse } from "../section/section.types";
import TaskController from "./task.controller";

const taskRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(constants.planner.section.task.name.MIN_LENGTH)
          .max(constants.planner.section.task.name.MAX_LENGTH),
        description: z
          .string()
          .max(constants.planner.section.task.description.MAX_LENGTH)
          .optional(),
        completed: z.boolean().default(false),
        due_date: z.date().optional(),
        start_date: z.date().optional(),
        section_id: z.custom<Types.ObjectId>(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new TaskController().createTaskHandler(input, ctx),
    ),

  update: protectedProcedure
    .input(
      z.object({
        id: z.custom<Types.ObjectId>(),
        name: z
          .string()
          .min(constants.planner.section.task.name.MIN_LENGTH)
          .max(constants.planner.section.task.name.MAX_LENGTH)
          .optional(),
        description: z
          .string()
          .max(constants.planner.section.task.description.MAX_LENGTH)
          .optional(),
        completed: z.boolean().optional(),
        due_date: z.date().optional(),
        start_date: z.date().optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new TaskController().updateTaskHandler(input.id, input, ctx),
    ),

  delete: protectedProcedure
    .input(z.array(z.custom<Types.ObjectId>()))
    .mutation(({ input, ctx }) =>
      new TaskController().deleteTasksHandler(input, ctx),
    ),

  reorder: protectedProcedure
    .input(z.custom<TSectionResponse[]>())
    .mutation(({ input, ctx }) =>
      new TaskController().reorderTasksHandler(input, ctx),
    ),
});

export default taskRouter;
