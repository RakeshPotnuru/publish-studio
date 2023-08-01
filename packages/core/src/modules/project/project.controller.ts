import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app.config";
import type { Context } from "../../trpc";
import ProjectService from "./project.service";
import type { IProject } from "./project.types";

export default class ProjectController extends ProjectService {
    async createProjectHandler(input: IProject, ctx: Context) {
        try {
            const project = await this.createProject({
                user_id: ctx.user?._id,
                folder_id: input.folder_id,
                title: input.title,
                description: input.description,
                body: input.body,
                tags: input.tags,
                status: input.status,
                cover_image: input.cover_image,
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
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async getProjectHandler(input: { id: Types.ObjectId }) {
        try {
            const project = await this.getProjectById(input.id);

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
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async getAllProjectsHandler(ctx: Context) {
        try {
            const projects = await this.getProjectsByUserId(ctx.user?._id);

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
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async updateProjectHandler(input: { id: Types.ObjectId; project: IProject }) {
        try {
            const project = await this.updateProjectById(input.id, input.project);

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
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async deleteProjectHandler(input: { id: Types.ObjectId }) {
        try {
            const project = await this.deleteProjectById(input.id);

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
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
