import type { Types } from "mongoose";
import { z } from "zod";

import { constants } from "../../constants";
import { protectedProcedure, router } from "../../trpc";
import FolderController from "./folder.controller";

const folderRouter = router({
    createFolder: protectedProcedure
        .input(
            z.object({
                name: z
                    .string()
                    .min(constants.folder.name.MIN_LENGTH)
                    .max(constants.folder.name.MAX_LENGTH),
            }),
        )
        .mutation(({ input, ctx }) => new FolderController().createFolderHandler(input, ctx)),

    getAllFolders: protectedProcedure.query(({ ctx }) =>
        new FolderController().getAllFoldersHandler(ctx),
    ),

    updateFolder: protectedProcedure
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
        .mutation(({ input }) => new FolderController().updateFolderHandler(input)),

    deleteFolder: protectedProcedure
        .input(
            z.object({
                id: z.custom<Types.ObjectId>(),
            }),
        )
        .mutation(({ input }) => new FolderController().deleteFolderHandler(input)),
});

export default folderRouter;
