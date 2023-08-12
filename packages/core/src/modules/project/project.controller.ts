import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import { user } from "../../utils/constants";
import DevToController from "../platform/devto/devto.controller";
import HashnodeController from "../platform/hashnode/hashnode.controller";
import MediumController from "../platform/medium/medium.controller";
import ProjectService from "./project.service";
import type { hashnode_tags, IProject } from "./project.types";

export default class ProjectController extends ProjectService {
    async createProjectHandler(input: { project: IProject }, ctx: Context) {
        const { project } = input;

        const newProject = await super.createProject({
            user_id: ctx.user?._id,
            folder_id: project.folder_id,
            title: project.title,
            description: project.description,
            body: project.body,
            tags: project.tags,
            status: project.status,
            cover_image: project.cover_image,
        });

        return {
            success: true,
            data: {
                project: newProject,
            },
        };
    }

    async publishPostHandler(
        input: {
            project_id: Types.ObjectId;
            platforms: (typeof user.platforms)[keyof typeof user.platforms][];
            hashnode_tags?: hashnode_tags;
        },
        ctx: Context,
    ) {
        const { project_id, platforms, hashnode_tags } = input;

        const project = await super.updateProjectById(project_id, {
            platforms: platforms,
        });

        const publishResponse = [] as {
            platform: (typeof user.platforms)[keyof typeof user.platforms];
            status: "success" | "error";
            url: string;
        }[];

        if (project.platforms?.includes(user.platforms.DEVTO)) {
            const response = await new DevToController().createPostHandler(
                {
                    post: project,
                },
                ctx,
            );

            publishResponse.push({
                platform: user.platforms.DEVTO,
                status: response.data.post.error ? "error" : "success",
                url: response.data.post.url,
            });
        }

        if (project.platforms?.includes(user.platforms.HASHNODE)) {
            const hashnodeUser = await new HashnodeController().getPlatformById(ctx.user?._id);
            const response = await new HashnodeController().createPostHandler(
                {
                    post: project,
                    hashnode_tags: hashnode_tags,
                },
                ctx,
            );

            const blogHandle = hashnodeUser?.blog_handle ?? "unknown";
            const postSlug = response.data.post.data.createStory.post.slug ?? "unknown";

            publishResponse.push({
                platform: user.platforms.HASHNODE,
                status: response.data.post?.errors ? "error" : "success",
                url: `https://${blogHandle}.hashnode.dev/${postSlug}`,
            });
        }

        if (project.platforms?.includes(user.platforms.MEDIUM)) {
            const response = await new MediumController().createPostHandler(
                {
                    post: project,
                },
                ctx,
            );

            publishResponse.push({
                platform: user.platforms.MEDIUM,
                status: response.data.post.errors ? "error" : "success",
                url: response.data.post.data.url,
            });
        }

        return {
            status: "success",
            data: {
                publishResponse: publishResponse,
            },
        };
    }

    async getProjectHandler(input: { id: Types.ObjectId }) {
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
    }

    async getAllProjectsHandler(ctx: Context) {
        const projects = await super.getProjectsByUserId(ctx.user?._id);

        return {
            status: "success",
            data: {
                projects: projects,
            },
        };
    }

    async updateProjectHandler(input: { id: Types.ObjectId; project: IProject }) {
        const project = await super.getProjectById(input.id);

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        const updatedProject = await super.updateProjectById(input.id, input.project);

        return {
            status: "success",
            data: {
                project: updatedProject,
            },
        };
    }

    async deleteProjectHandler(input: { id: Types.ObjectId }) {
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
    }
}
