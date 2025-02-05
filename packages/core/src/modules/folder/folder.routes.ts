import type { Types } from "mongoose";
import { z } from "zod";

import { constants } from "../../config/constants";
import { proProtectedProcedure, router } from "../../trpc";
import FolderController from "./folder.controller";

const folderRouter = router({
  create: proProtectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(constants.folder.name.MIN_LENGTH)
          .max(constants.folder.name.MAX_LENGTH),
      }),
    )
    .mutation(({ input, ctx }) =>
      new FolderController().createFolderHandler(input, ctx),
    ),

  getAll: proProtectedProcedure
    .input(
      z.object({
        pagination: z.object({
          page: z.number().int().positive().default(1),
          limit: z.number().int().positive().default(10),
        }),
      }),
    )
    .query(({ input, ctx }) =>
      new FolderController().getAllFoldersHandler(input, ctx),
    ),

  update: proProtectedProcedure
    .input(
      z.object({
        id: z.custom<Types.ObjectId>(),
        folder: z.object({
          name: z
            .string()
            .min(constants.folder.name.MIN_LENGTH)
            .max(constants.folder.name.MAX_LENGTH),
        }),
      }),
    )
    .mutation(({ input, ctx }) =>
      new FolderController().updateFolderHandler(input, ctx),
    ),

  delete: proProtectedProcedure
    .input(z.array(z.custom<Types.ObjectId>()))
    .mutation(({ input, ctx }) =>
      new FolderController().deleteFoldersHandler(input, ctx),
    ),
});

export default folderRouter;
