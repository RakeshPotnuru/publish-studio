import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import FolderService from "./folder.service";
import type { IFolder } from "./folder.types";

export default class FolderController extends FolderService {
    async createFolderHandler(input: IFolder, ctx: Context) {
        const folder = await super.getFolderByName(input.name);

        if (folder) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Folder with that name already exists",
            });
        }

        const newFolder = await super.createFolder({
            user_id: ctx.user?._id,
            name: input.name,
        });

        return {
            status: "success",
            data: {
                folder: newFolder,
            },
        };
    }

    async getAllFoldersHandler(ctx: Context) {
        const folders = await super.getAllFolders(ctx.user?._id);

        return {
            status: "success",
            data: {
                folders: folders,
            },
        };
    }

    async updateFolderHandler(input: { id: Types.ObjectId; folder: IFolder }) {
        const folder = await super.getFolderByName(input.folder.name);

        if (folder) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Folder with that name already exists",
            });
        }

        const updatedFolder = await super.updateFolder(input.id, input.folder);

        return {
            status: "success",
            data: {
                folder: updatedFolder,
            },
        };
    }

    async deleteFolderHandler(input: { id: Types.ObjectId }) {
        const folder = await super.getFolderById(input.id);

        if (!folder) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Folder not found",
            });
        }

        const deletedFolder = await super.deleteFolder(input.id);

        return {
            status: "success",
            data: {
                folder: deletedFolder,
            },
        };
    }
}
