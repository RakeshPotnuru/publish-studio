import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import FolderService from "./folder.service";
import type { IFolder } from "./folder.types";

export default class FolderController extends FolderService {
    /**
     * The `createFolderHandler` function creates a new folder if it doesn't already exist and returns
     * the newly created folder.
     * @param {IFolder} input - The `input` parameter is an object of type `IFolder` which represents
     * the folder data that needs to be created. It typically contains properties like `name` which
     * represents the name of the folder.
     * @param {Context} ctx - The `ctx` parameter is of type `Context` and is used to provide context
     * information for the function. It may contain information such as the user who is making the
     * request, authentication details, or any other relevant information needed for the function to
     * execute properly.
     * @returns an object with a "status" property set to "success" and a "data" property containing
     * the newly created folder.
     */
    async createFolderHandler(input: IFolder, ctx: Context) {
        try {
            const folder = await this.getFolderByName(input.name);

            if (folder) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Folder with that name already exists",
                });
            }

            const newFolder = await this.createFolder({
                user_id: ctx.user?._id,
                name: input.name,
            });

            return {
                status: "success",
                data: {
                    folder: newFolder,
                },
            };
        } catch (error: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
            });
        }
    }

    async getAllFoldersHandler(ctx: Context) {
        try {
            const folders = await this.getAllFolders(ctx.user?._id);

            return {
                status: "success",
                data: {
                    folders: folders,
                },
            };
        } catch (error: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
            });
        }
    }

    async updateFolderHandler(input: { id: Types.ObjectId; folder: IFolder }) {
        try {
            const folder = await this.getFolderByName(input.folder.name);

            if (folder) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Folder with that name already exists",
                });
            }

            const updatedFolder = await this.updateFolder(input.id, input.folder);

            return {
                status: "success",
                data: {
                    folder: updatedFolder,
                },
            };
        } catch (error: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
            });
        }
    }

    async deleteFolderHandler(input: { id: Types.ObjectId }) {
        try {
            const folder = await this.getFolderById(input.id);

            if (!folder) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Folder not found",
                });
            }

            const deletedFolder = await this.deleteFolder(input.id);

            return {
                status: "success",
                data: {
                    folder: deletedFolder,
                },
            };
        } catch (error: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
            });
        }
    }
}
