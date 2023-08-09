import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import { user } from "../../utils/constants";
import DevToController from "../platform/devto/devto.controller";
import HashnodeController from "../platform/hashnode/hashnode.controller";
import MediumController from "../platform/medium/medium.controller";
import ProjectService from "./project.service";
import type { IProject } from "./project.types";

export default class ProjectController extends ProjectService {
    async createProjectHandler(input: { project: IProject }, ctx: Context) {
        const { project } = input;

        await super.createProject({
            user_id: ctx.user?._id,
            folder_id: project.folder_id,
            title: project.title,
            description: project.description,
            body: project.body,
            tags: project.tags,
            status: project.status,
            cover_image: project.cover_image,
            platforms: project.platforms,
        });

        const publishResponse = [{}] as {
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
                status: response.data.post.error ? "error" : "success",
                url: response.data.post.article.url,
            });
        }

        if (project.platforms?.includes(user.platforms.HASHNODE)) {
            const response = await new HashnodeController().createPostHandler(
                {
                    post: project,
                },
                ctx,
            );

            publishResponse.push({
                status: response.data.post.errors ? "error" : "success",
                url: `https://${response.data.post.post.blogHandle}.hashnode.dev/${response.data.post.post.slug}`,
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
                status: response.data.post.errors ? "error" : "success",
                url: response.data.post.url,
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
