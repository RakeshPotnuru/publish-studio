import type { Types } from "mongoose";
import { z } from "zod";

import { constants } from "../../../config/constants";
import { proProtectedProcedure, router } from "../../../trpc";
import SectionController from "./section.controller";

const sectionRouter = router({
  getAll: proProtectedProcedure.query(({ ctx }) =>
    new SectionController().getSections(ctx.user._id),
  ),

  create: proProtectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(constants.planner.section.name.MIN_LENGTH, "Name is too short")
          .max(constants.planner.section.name.MAX_LENGTH, "Name is too long"),
      }),
    )
    .mutation(({ input, ctx }) =>
      new SectionController().createSectionHandler(input, ctx),
    ),

  update: proProtectedProcedure
    .input(
      z.object({
        _id: z.custom<Types.ObjectId>(),
        name: z
          .string()
          .min(constants.planner.section.name.MIN_LENGTH, "Name is too short")
          .max(constants.planner.section.name.MAX_LENGTH, "Name is too long")
          .optional(),
        order: z.number().optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new SectionController().updateSectionHandler(input, ctx),
    ),

  delete: proProtectedProcedure
    .input(z.array(z.custom<Types.ObjectId>()))
    .mutation(({ input, ctx }) =>
      new SectionController().deleteSectionsHandler(input, ctx),
    ),

  reorder: proProtectedProcedure
    .input(
      z.array(z.object({ _id: z.custom<Types.ObjectId>(), order: z.number() })),
    )
    .mutation(({ input, ctx }) =>
      new SectionController().reorderSectionsHandler(input, ctx),
    ),
});

export default sectionRouter;
