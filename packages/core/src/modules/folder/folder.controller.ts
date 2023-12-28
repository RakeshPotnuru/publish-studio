import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import FolderService from "./folder.service";
import type { IFolder } from "./folder.types";

export default class FolderController extends FolderService {
    async createFolderHandler(input: IFolder, ctx: Context) {
        const folder = await super.getFolderByName(input.name, ctx.user?._id);

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

    async getAllFoldersHandler(
        input: {
            pagination: {
                page: number;
                limit: number;
            };
        },
        ctx: Context,
    ) {
        const { folders, pagination } = await super.getAllFoldersByUserId(
            input.pagination,
            ctx.user?._id,
        );

        return {
            status: "success",
            data: {
                folders,
                pagination,
            },
        };
    }

    async updateFolderHandler(input: { id: Types.ObjectId; folder: IFolder }, ctx: Context) {
        const isFolderExist = await super.getFolderById(input.id, ctx.user?._id);

        if (!isFolderExist) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Folder not found",
            });
        }

        const isFolderNameExists = await super.getFolderByName(input.folder.name, ctx.user?._id);

        if (isFolderNameExists) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Folder with that name already exists",
            });
        }

        const updatedFolder = await super.updateFolder(input.id, ctx.user?._id, input.folder);

        return {
            status: "success",
            data: {
                folder: updatedFolder,
            },
        };
    }

    async deleteFoldersHandler(input: Types.ObjectId[], ctx: Context) {
        const deletedFolders = await super.deleteFolders(input, ctx.user?._id);

        return {
            status: "success",
            data: {
                folders: deletedFolders,
            },
        };
    }
}
