import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import ProjectService from "./project.service";
import type { IProject } from "./project.types";

export default class ProjectController extends ProjectService {
    async createProjectHandler(input: IProject, ctx: Context) {
        try {
            const project = await super.createProject({
                user_id: ctx.user?._id,
                folder_id: input.folder_id,
                title: input.title,
                description: input.description,
                body: input.body,
                tags: input.tags,
                status: input.status,
                cover_image: input.cover_image,
                platforms: input.platforms,
            });

            return {
                status: "success",
                data: {
                    project: project,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the project.",
            });
        }
    }

    async getProjectHandler(input: { id: Types.ObjectId }) {
        try {
            const project = await super.getProjectById(input.id);

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found",
                });
            }

            return {
                status: "success",
                data: {
                    project: project,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the project.",
            });
        }
    }

    async getAllProjectsHandler(ctx: Context) {
        try {
            const projects = await super.getProjectsByUserId(ctx.user?._id);

            return {
                status: "success",
                data: {
                    projects: projects,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the projects.",
            });
        }
    }

    async updateProjectHandler(input: { id: Types.ObjectId; project: IProject }) {
        try {
            const project = await super.getProjectById(input.id);

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found",
                });
            }

            const updatedProject = await super.updateProjectById(input.id, input.project);

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found",
                });
            }

            return {
                status: "success",
                data: {
                    project: updatedProject,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the project.",
            });
        }
    }

    async deleteProjectHandler(input: { id: Types.ObjectId }) {
        try {
            const project = await super.deleteProjectById(input.id);

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found",
                });
            }

            return {
                status: "success",
                data: {
                    project: project,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while deleting the project.",
            });
        }
    }
}
