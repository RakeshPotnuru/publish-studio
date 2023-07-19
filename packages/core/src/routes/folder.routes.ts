import { Types } from "mongoose";
import { z } from "zod";

import FolderController from "../controllers/folder.controller";
import { t } from "../trpc";

const folderRouter = t.router({
    createFolder: t.procedure
        .input(
            z.object({
                name: z.string().min(3).max(160),
            }),
        )
        .mutation(({ input, ctx }) => new FolderController().createFolderHandler(input, ctx)),

    updateFolder: t.procedure
        .input(
            z.object({
                id: z.instanceof(Types.ObjectId),
                folder: z.object({
                    name: z.string().min(3).max(160),
                }),
            }),
        )
        .mutation(({ input }) => new FolderController().updateFolderHandler(input)),

    deleteFolder: t.procedure
        .input(
            z.object({
                id: z.instanceof(Types.ObjectId),
            }),
        )
        .mutation(({ input }) => new FolderController().deleteFolderHandler(input)),
});

export default folderRouter;
