import type { Types } from "mongoose";

import Folder from "../folder/folder.model";
import User from "../user/user.model";
import Project from "./project.model";
import type { IProject } from "./project.types";

export default class ProjectService {
    async createProject(project: IProject) {
        const newProject = await Project.create(project);

        await User.findByIdAndUpdate(project.user_id, {
            $push: { projects: newProject._id },
        }).exec();

        if (project.folder_id) {
            await Folder.findByIdAndUpdate(project.folder_id, {
                $push: { projects: newProject._id },
            }).exec();
        }

        return newProject as IProject;
    }

    async getProjectById(id: Types.ObjectId) {
        return (await Project.findById(id).exec()) as IProject;
    }

    async getProjectsByUserId(user_id: Types.ObjectId | undefined) {
        return (await Project.find({ user_id }).exec()) as IProject[];
    }

    async getProjectsByFolderId(folder_id: Types.ObjectId) {
        return (await Project.find({ folder_id }).exec()) as IProject[];
    }

    async updateProjectById(id: Types.ObjectId, project: IProject) {
        return (await Project.findByIdAndUpdate(id, project, { new: true }).exec()) as IProject;
    }

    async deleteProjectById(id: Types.ObjectId) {
        return (await Project.findByIdAndDelete(id).exec()) as IProject;
    }
}
