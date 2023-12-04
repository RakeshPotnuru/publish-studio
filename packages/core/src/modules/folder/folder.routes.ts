import type { Types } from "mongoose";
import { z } from "zod";

import { constants } from "../../config/constants";
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

    getAllFolders: protectedProcedure
        .input(
            z.object({
                pagination: z.object({
                    page: z.number().min(1).default(1),
                    limit: z.number().min(1).default(10),
                }),
            }),
        )
        .mutation(({ input, ctx }) => new FolderController().getAllFoldersHandler(input, ctx)),

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
