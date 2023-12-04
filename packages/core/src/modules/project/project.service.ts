import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { IPagination } from "../../types/common.types";
import Folder from "../folder/folder.model";
import FolderService from "../folder/folder.service";
import User from "../user/user.model";
import Project from "./project.model";
import type { IProject, IProjectUpdate } from "./project.types";

export default class ProjectService extends FolderService {
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
            console.log(error);

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
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the project. Please try again later.",
            });
        }
    }

    async getAllProjectsByUserId(pagination: IPagination, user_id: Types.ObjectId | undefined) {
        try {
            const total_rows = await Project.countDocuments({ user_id }).exec();
            const total_pages = Math.ceil(total_rows / pagination.limit);

            const projects = (await Project.find({ user_id })
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit)
                .exec()) as IProject[];

            return {
                projects,
                pagination: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total_rows,
                    total_pages,
                },
            };
        } catch (error) {
            console.log(error);

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
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the projects. Please try again later.",
            });
        }
    }

    async updateProjectById(id: Types.ObjectId, project: IProjectUpdate) {
        try {
            return (await Project.findByIdAndUpdate(id, project, { new: true }).exec()) as IProject;
        } catch (error) {
            console.log(error);

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
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while deleting the project. Please try again later.",
            });
        }
    }
}
