import type { Types } from "mongoose";
import { z } from "zod";

import { protectedProcedure, t } from "../../trpc";
import FolderController from "./folder.controller";

const folderRouter = t.router({
    createFolder: protectedProcedure
        .input(
            z.object({
                name: z.string().min(3).max(160),
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
                    name: z.string().min(3).max(160),
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
