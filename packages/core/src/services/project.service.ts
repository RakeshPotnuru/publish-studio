import type { Types } from "mongoose";

import Project from "../models/project.model";
import type { IProject } from "../types/project.types";

export default class ProjectService {
    async createProject(project: IProject) {
        return (await Project.create(project)) as IProject;
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
