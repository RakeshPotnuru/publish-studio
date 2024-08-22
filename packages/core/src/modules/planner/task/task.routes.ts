import type { Types } from "mongoose";
import { z } from "zod";

import { constants } from "../../../config/constants";
import { proProtectedProcedure, router } from "../../../trpc";
import type { TSectionResponse } from "../section/section.types";
import TaskController from "./task.controller";

const taskRouter = router({
  create: proProtectedProcedure
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

  update: proProtectedProcedure
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

  delete: proProtectedProcedure
    .input(z.array(z.custom<Types.ObjectId>()))
    .mutation(({ input, ctx }) =>
      new TaskController().deleteTasksHandler(input, ctx),
    ),

  reorder: proProtectedProcedure
    .input(z.custom<TSectionResponse[]>())
    .mutation(({ input, ctx }) =>
      new TaskController().reorderTasksHandler(input, ctx),
    ),
});

export default taskRouter;
