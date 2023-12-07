import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import Project from "../project/project.model";
import Folder from "./folder.model";
import type { IFolder, IFoldersResponse } from "./folder.types";

export default class FolderService {
    async createFolder(folder: IFolder) {
        try {
            return (await Folder.create(folder)) as IFolder;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the folder. Please try again later.",
            });
        }
    }

    async getFolderByName(name: string, user_id: Types.ObjectId | undefined) {
        try {
            return (await Folder.findOne({ user_id, name }).exec()) as IFolder;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the folder. Please try again later.",
            });
        }
    }

    async getFolderById(id: Types.ObjectId, user_id: Types.ObjectId | undefined) {
        try {
            return (await Folder.findOne({ user_id, _id: id }).exec()) as IFolder;
        } catch {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the folder. Please try again later.",
            });
        }
    }

    async getAllFoldersByUserId(
        pagination: { page: number; limit: number },
        user_id: Types.ObjectId | undefined,
    ) {
        try {
            const total_rows = await Folder.countDocuments({ user_id }).exec();
            const total_pages = Math.ceil(total_rows / pagination.limit);

            const folders = (await Folder.find({ user_id })
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit)
                .sort({ updated_at: -1 })
                .exec()) as IFolder[];

            return {
                folders,
                pagination: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total_rows,
                    total_pages,
                },
            } as IFoldersResponse;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the folders. Please try again later.",
            });
        }
    }

    async updateFolder(id: Types.ObjectId, user_id: Types.ObjectId | undefined, folder: IFolder) {
        try {
            return (await Folder.findOneAndUpdate({ user_id, _id: id }, folder, {
                new: true,
            }).exec()) as IFolder;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the folder. Please try again later.",
            });
        }
    }

    /**
     * The function deletes a folder by setting the folder_id to null in the associated project and
     * then deleting the folder itself.
     * @param id - The `id` parameter is of type `Types.ObjectId`. It represents the unique identifier
     * of the folder that needs to be deleted.
     * @returns the deleted folder as an IFolder object.
     */
    async deleteFolder(id: Types.ObjectId, user_id: Types.ObjectId | undefined) {
        try {
            await Project.findOneAndUpdate({ user_id, folder_id: id }, { folder_id: null }).exec();
            return (await Folder.findOneAndDelete({ user_id, _id: id }).exec()) as IFolder;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while deleting the folder. Please try again later.",
            });
        }
    }
}
