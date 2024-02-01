import { TRPCError } from "@trpc/server";

import { PostStatus, ProjectStatus } from "../../../config/constants";
import type { Context } from "../../../trpc";
import type { IPublish, TEdit } from "../post.types";
import PublishHelpers from "./publish.helpers";
import PublishService from "./publish.service";

export default class PublishController extends PublishService {
    async publishPostHandler(input: Omit<IPublish, "user_id">, ctx: Context) {
        const { project_id, scheduled_at, platforms } = input;

        const project = await super.getProjectById(project_id, ctx.user._id);

        if (!project) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Project not found",
            });
        }

        for (const platform of platforms) {
            await super.createPostHandler(
                {
                    platform,
                    project_id,
                    status: PostStatus.PENDING,
                },
                ctx,
            );
        }

        if (scheduled_at) {
            await new PublishHelpers().schedulePost({
                platforms,
                project,
                scheduled_at,
                user_id: ctx.user._id,
            });

            await super.updateProjectById(
                project_id,
                {
                    platforms,
                    status: ProjectStatus.SCHEDULED,
                    scheduled_at,
                },
                ctx.user._id,
            );
        } else {
            await super.publishPost(platforms, project, ctx.user._id);

            await super.updateProjectById(
                project_id,
                {
                    platforms,
                },
                ctx.user._id,
            );
        }

        return {
            status: "success",
            data: {
                message: "Post added to queue successfully. You will be notified when published.",
            },
        };
    }

    async editPostHandler(input: Omit<TEdit, "user_id">, ctx: Context) {
        const { platforms, project_id } = input;

        const project = await super.getProjectById(project_id, ctx.user._id);

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        await super.editPost(platforms, project, ctx);

        return {
            status: "success",
            data: {
                message: "Post edited successfully.",
            },
        };
    }
}
