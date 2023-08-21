import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import Project from "../project/project.model";
import Folder from "./folder.model";
import type { IFolder } from "./folder.types";

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

    async getFolderByName(name: string) {
        try {
            return (await Folder.findOne({ name }).exec()) as IFolder;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the folder. Please try again later.",
            });
        }
    }

    async getFolderById(id: Types.ObjectId) {
        try {
            return (await Folder.findById(id).exec()) as IFolder;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the folder. Please try again later.",
            });
        }
    }

    async getAllFolders(user_id: Types.ObjectId | undefined) {
        try {
            return (await Folder.find({ user_id }).populate("projects").exec()) as IFolder[];
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the folders. Please try again later.",
            });
        }
    }

    async updateFolder(id: Types.ObjectId, folder: IFolder) {
        try {
            return (await Folder.findByIdAndUpdate(id, folder, { new: true }).exec()) as IFolder;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the folder. Please try again later.",
            });
        }
    }

    /**
     * The function deletes a folder and all associated projects from a database.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
     * folder that needs to be deleted.
     * @returns the deleted folder as an IFolder object.
     */
    async deleteFolder(id: Types.ObjectId) {
        try {
            await Project.find({ folder_id: id }).deleteMany().exec();
            return (await Folder.findByIdAndDelete(id).exec()) as IFolder;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while deleting the folder. Please try again later.",
            });
        }
    }
}
