import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app.config";
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
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    /**
     * The function `getAllFoldersHandler` retrieves all folders for a user and returns them in a
     * success response, or throws an error if there is an internal server error.
     * @param {Context} ctx - The `ctx` parameter is an object that represents the context of the
     * current request. It contains information such as the user who is making the request,
     * authentication details, or any other relevant information needed for the function to execute
     * properly.
     * @returns an object with a "status" property set to "success" and a "data" property containing an
     * object with a "folders" property. The value of the "folders" property is the result of the
     * `super.getAllFolders(ctx.user?._id)` function call.
     */
    async getAllFoldersHandler(ctx: Context) {
        try {
            const folders = await super.getAllFolders(ctx.user?._id);

            return {
                status: "success",
                data: {
                    folders: folders,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    /**
     * The function `updateFolderHandler` updates a folder with the given ID and folder object,
     * checking for conflicts and returning the updated folder if successful.
     * @param input - The `input` parameter is an object that contains two properties: `id` and
     * `folder`. The `id` property is a string representing the ID of the folder to be updated, and
     * the `folder` property is an object of type `IFolder` which represents the folder data that
     * needs to be updated.
     * @returns an object with a "status" property set to "success" and a "data" property containing
     * the updated folder.
     */
    async updateFolderHandler(input: { id: Types.ObjectId; folder: IFolder }) {
        try {
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
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    /**
     * The `deleteFolderHandler` function deletes a folder based on the provided ID and returns the
     * deleted folder as a success response.
     * @param input - The `input` parameter is an object that contains the `id` property. The `id`
     * property is of type `Types.ObjectId`, which is likely a unique identifier for a folder.
     * @returns an object with a "status" property set to "success" and a "data" property containing
     * the deleted folder.
     */
    async deleteFolderHandler(input: { id: Types.ObjectId }) {
        try {
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
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
