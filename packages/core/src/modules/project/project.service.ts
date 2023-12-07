import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import Folder from "../folder/folder.model";
import FolderService from "../folder/folder.service";
import User from "../user/user.model";
import Project from "./project.model";
import type { IProject, IProjectsResponse, IProjectUpdate } from "./project.types";

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

    async getProjectById(id: Types.ObjectId, user_id?: Types.ObjectId) {
        try {
            return (await Project.findOne({ _id: id, user_id }).exec()) as IProject;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the project. Please try again later.",
            });
        }
    }

    async getAllProjectsByUserId(
        pagination: {
            page: number;
            limit: number;
        },
        user_id: Types.ObjectId | undefined,
    ) {
        try {
            const total_rows = await Project.countDocuments({ user_id }).exec();
            const total_pages = Math.ceil(total_rows / pagination.limit);

            const projects = (await Project.find({ user_id })
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit)
                .sort({ updated_at: -1 })
                .exec()) as IProject[];

            return {
                projects,
                pagination: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total_rows,
                    total_pages,
                },
            } as IProjectsResponse;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the projects. Please try again later.",
            });
        }
    }

    async getProjectsByFolderId(
        pagination: {
            page: number;
            limit: number;
        },
        folder_id: Types.ObjectId,
        user_id: Types.ObjectId | undefined,
    ) {
        try {
            const total_rows = await Project.countDocuments({ folder_id, user_id }).exec();
            const total_pages = Math.ceil(total_rows / pagination.limit);

            const projects = (await Project.find({ folder_id, user_id })
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit)
                .sort({ updated_at: -1 })
                .exec()) as IProject[];

            return {
                projects,
                pagination: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total_rows,
                    total_pages,
                },
            } as IProjectsResponse;
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

    async deleteProjectById(id: Types.ObjectId, user_id: Types.ObjectId | undefined) {
        try {
            return (await Project.findOneAndDelete({ _id: id, user_id }).exec()) as IProject;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while deleting the project. Please try again later.",
            });
        }
    }
}
