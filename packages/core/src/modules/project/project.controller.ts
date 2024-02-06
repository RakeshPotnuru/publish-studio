import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import type { IPaginationOptions } from "../../types/common.types";
import GenerativeAIController from "../generative-ai/generative-ai.controller";
import ProjectService from "./project.service";
import type { IProjectUpdateInput, TProjectCreateFormInput } from "./project.types";

export default class ProjectController extends ProjectService {
    async createProjectHandler(input: TProjectCreateFormInput, ctx: Context) {
        const project = input;

        if (project.folder_id) {
            const folder = await super.getFolderById(project.folder_id, ctx.user._id);

            if (!folder) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Folder not found.",
                });
            }
        }

        const newProject = await super.createProject({
            user_id: ctx.user._id,
            ...project,
        });

        try {
            const genAI = new GenerativeAIController();

            let categories: string[] | undefined;

            const text = project.description ?? project.title ?? project.name;
            if (text) {
                const { data } = await genAI.generateCategoriesHandler({ text }, ctx);
                categories = data.categories.length > 0 ? data.categories : undefined;
            }

            await super.updateProjectById(
                newProject._id,
                {
                    categories,
                },
                ctx.user._id,
            );
        } catch (error) {
            console.log(error);
        }

        return {
            success: true,
            data: {
                project: newProject,
            },
        };
    }

    async getProjectByIdHandler(input: Types.ObjectId, ctx: Context) {
        const project = await super.getProjectById(input, ctx.user._id);

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        return {
            status: "success",
            data: {
                project,
            },
        };
    }

    async getAllProjectsHandler(
        input: {
            pagination: {
                page: number;
                limit: number;
            };
        },
        ctx: Context,
    ) {
        const { projects, pagination } = await super.getAllProjectsByUserId(
            input.pagination,
            ctx.user._id,
        );

        return {
            status: "success",
            data: {
                projects,
                pagination,
            },
        };
    }

    async getProjectsByFolderIdHandler(
        input: {
            folder_id: Types.ObjectId;
            pagination: IPaginationOptions;
        },
        ctx: Context,
    ) {
        const folder = await super.getFolderById(input.folder_id, ctx.user._id);

        const { projects, pagination } = await super.getProjectsByFolderId(
            input.pagination,
            input.folder_id,
            ctx.user._id,
        );

        return {
            status: "success",
            data: {
                folder_name: folder?.name,
                projects,
                pagination,
            },
        };
    }

    async updateProjectHandler(
        input: { id: Types.ObjectId; project: IProjectUpdateInput },
        ctx: Context,
    ) {
        const project = await super.getProjectById(input.id, ctx.user._id);

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        if (input.project.folder_id) {
            const folder = await super.getFolderById(input.project.folder_id, ctx.user._id);

            if (!folder) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Folder not found.",
                });
            }
        }

        const updatedProject = await super.updateProjectById(input.id, input.project, ctx.user._id);

        return {
            status: "success",
            data: {
                project: updatedProject,
            },
        };
    }

    async deleteProjectsHandler(input: Types.ObjectId[], ctx: Context) {
        const project_ids: Types.ObjectId[] = [];

        for (const element of input) {
            const project = await super.getProjectById(element, ctx.user._id);

            if (project) {
                project_ids.push(element);
            }
        }

        const deletedProjects = await super.deleteProjects(project_ids, ctx.user._id);

        return {
            status: "success",
            data: {
                projects: deletedProjects,
            },
        };
    }
}
