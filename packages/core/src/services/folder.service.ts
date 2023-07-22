import type { Types } from "mongoose";

import Folder from "../models/folder.model";
import Project from "../models/project.model";
import type { IFolder } from "../types/folder.types";

export default class FolderService {
    async createFolder(folder: IFolder) {
        return (await Folder.create(folder)) as IFolder;
    }

    async getFolderByName(name: string) {
        return (await Folder.findOne({ name }).exec()) as IFolder;
    }

    async getFolderById(id: Types.ObjectId) {
        return (await Folder.findById(id).exec()) as IFolder;
    }

    async getAllFolders(user_id: Types.ObjectId | undefined) {
        return (await Folder.find({ user_id }).populate("projects").exec()) as IFolder[];
    }

    async updateFolder(id: Types.ObjectId, folder: IFolder) {
        return (await Folder.findByIdAndUpdate(id, folder, { new: true }).exec()) as IFolder;
    }

    /**
     * The function deletes a folder and all associated projects from a database.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
     * folder that needs to be deleted.
     * @returns the deleted folder as an IFolder object.
     */
    async deleteFolder(id: Types.ObjectId) {
        await Project.find({ folder_id: id }).deleteMany().exec();
        return (await Folder.findByIdAndDelete(id).exec()) as IFolder;
    }
}
