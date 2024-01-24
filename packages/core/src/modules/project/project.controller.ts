import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { constants } from "../../config/constants";
import type { Context } from "../../trpc";
import type { IPaginationOptions } from "../../types/common.types";
import GenerativeAIController from "../generative-ai/generative-ai.controller";
import type { TPlatformName } from "../platform/platform.types";
import ProjectHelpers from "./project.helpers";
import ProjectService from "./project.service";
import type {
    IProjectPlatform,
    IProjectUpdateInput,
    TProjectCreateFormInput,
} from "./project.types";

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
                const { data } = await genAI.generateCategoriesHandler({ text });
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

    async publishPost(project_id: Types.ObjectId, user_id: Types.ObjectId) {
        const project = await super.getProjectById(project_id, user_id);

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        const publishResponse = await new ProjectHelpers().publishOnPlatforms(project, user_id);

        await super.updateProjectById(
            project_id,
            {
                platforms: publishResponse,
                status: publishResponse.every(
                    platform =>
                        platform.status === constants.project.platformPublishStatuses.SUCCESS,
                )
                    ? constants.project.status.PUBLISHED
                    : constants.project.status.DRAFT,
                published_at: new Date(),
            },
            user_id,
        );

        return {
            status: "success",
            data: {
                response: publishResponse,
            },
        };
    }

    async updatePostHandler(
        input: {
            project_id: Types.ObjectId;
            platforms: {
                name: TPlatformName;
            }[];
        },
        ctx: Context,
    ) {
        const project = await super.getProjectById(input.project_id, ctx.user._id);

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        const updateResponse = await new ProjectHelpers().updateOnPlatforms(project, ctx.user._id);

        if (!updateResponse) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Project is not published.",
            });
        }

        await super.updateProjectById(
            input.project_id,
            {
                platforms: updateResponse,
                status:
                    updateResponse.length > 0 &&
                    updateResponse.every(
                        platform =>
                            platform.status === constants.project.platformPublishStatuses.SUCCESS,
                    )
                        ? constants.project.status.PUBLISHED
                        : constants.project.status.DRAFT,
            },
            ctx.user._id,
        );

        return {
            status: "success",
            data: {
                response: updateResponse,
            },
        };
    }

    async schedulePostHandler(
        input: {
            project_id: Types.ObjectId;
            scheduled_at: Date;
            platforms: IProjectPlatform[];
        },
        ctx: Context,
    ) {
        const { project_id, scheduled_at, platforms } = input;

        const project = await super.getProjectById(project_id, ctx.user._id);

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        /* This code block is checking if the number of platforms that the user has is equal to the
        number of platforms that the project has with a status of "SUCCESS". If they are equal, it
        means that the project has already been published on all platforms, so it throws a
        `TRPCError` with a code of "BAD_REQUEST" and a message stating that the project is already
        published. */
        if (
            ctx.user.platforms?.length ===
            project.platforms?.filter(
                platform => platform.status === constants.project.platformPublishStatuses.SUCCESS,
            ).length
        ) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Project is already published.",
            });
        }

        if (project.status === constants.project.status.SCHEDULED) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Project is already scheduled.",
            });
        }

        await super.updateProjectById(
            project_id,
            {
                scheduled_at: scheduled_at,
                platforms: platforms.map(platform => ({
                    name: platform.name,
                    status:
                        project.platforms?.find(
                            projectPlatform => projectPlatform.name === platform.name,
                        )?.status ?? constants.project.platformPublishStatuses.PENDING,
                    id: project.platforms?.find(
                        projectPlatform => projectPlatform.name === platform.name,
                    )?.id,
                    published_url: project.platforms?.find(
                        projectPlatform => projectPlatform.name === platform.name,
                    )?.published_url,
                })),
            },
            ctx.user._id,
        );

        const projectHelpers = new ProjectHelpers();

        await projectHelpers.schedulePost({
            project_id: project_id,
            scheduled_at: scheduled_at,
            user_id: ctx.user._id,
        });

        await super.updateProjectById(
            project_id,
            {
                status: constants.project.status.SCHEDULED,
            },
            ctx.user._id,
        );

        return {
            status: "success",
            data: {
                message: "Project scheduled successfully.",
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
