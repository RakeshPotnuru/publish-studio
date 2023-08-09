import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import Folder from "../folder/folder.model";
import User from "../user/user.model";
import Project from "./project.model";
import type { IProject } from "./project.types";

export default class ProjectService {
    async createProject(project: IProject) {
        try {
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
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the project. Please try again later.",
            });
        }
    }

    async getProjectById(id: Types.ObjectId) {
        try {
            return (await Project.findById(id).exec()) as IProject;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the project. Please try again later.",
            });
        }
    }

    async getProjectsByUserId(user_id: Types.ObjectId | undefined) {
        try {
            return (await Project.find({ user_id }).exec()) as IProject[];
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the projects. Please try again later.",
            });
        }
    }

    async getProjectsByFolderId(folder_id: Types.ObjectId) {
        try {
            return (await Project.find({ folder_id }).exec()) as IProject[];
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the projects. Please try again later.",
            });
        }
    }

    async updateProjectById(id: Types.ObjectId, project: IProject) {
        try {
            return (await Project.findByIdAndUpdate(id, project, { new: true }).exec()) as IProject;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the project. Please try again later.",
            });
        }
    }

    async deleteProjectById(id: Types.ObjectId) {
        try {
            return (await Project.findByIdAndDelete(id).exec()) as IProject;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while deleting the project. Please try again later.",
            });
        }
    }
}
