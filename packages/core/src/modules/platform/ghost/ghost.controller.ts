import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { constants } from "../../../config/constants";
import type { Context } from "../../../trpc";
import { encryptField } from "../../../utils/aws/kms";
import type { IProject, IProjectPlatform } from "../../project/project.types";
import GhostService from "./ghost.service";
import type { IGhost, TGhostUpdate } from "./ghost.types";

export default class GhostController extends GhostService {
    async createPlatformHandler(input: IGhost, ctx: Context) {
        const site = await super.getGhostSite(input.api_url, input.admin_api_key);

        if (!site.success) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Invalid fields. Site not found.",
            });
        }

        const platform = await super.getPlatformByAPIUrl(input.api_url);

        if (platform) {
            await super.deletePlatform(platform.user_id);
        }

        const newPlatform = await super.createPlatform({
            user_id: ctx.user?._id,
            api_url: input.api_url,
            admin_api_key: input.admin_api_key,
            status: input.status,
        });

        return {
            status: "success",
            data: {
                user: newPlatform,
            },
        };
    }

    async updatePlatformHandler(input: TGhostUpdate, ctx: Context) {
        if (input.admin_api_key && input.api_url) {
            const site = await super.getGhostSite(input.api_url, input.admin_api_key);

            if (!site.success) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invalid fields. Site not found.",
                });
            }

            const platform = await super.getPlatformByAPIUrl(input.api_url);

            if (platform) {
                await super.deletePlatform(platform.user_id);
            }

            input.admin_api_key = await encryptField(input.admin_api_key);

            const updatedPlatform = await super.updatePlatform(
                {
                    api_url: input.api_url,
                    admin_api_key: input.admin_api_key,
                    status: input.status,
                },
                ctx.user?._id,
            );

            return {
                status: "success",
                data: {
                    user: updatedPlatform,
                },
            };
        }

        const updatedPlatform = await super.updatePlatform(
            {
                status: input.status,
            },
            ctx.user?._id,
        );

        return {
            status: "success",
            data: {
                user: updatedPlatform,
            },
        };
    }

    async deletePlatformHandler(ctx: Context) {
        const user = await super.getPlatform(ctx.user?._id);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found.",
            });
        }

        await super.deletePlatform(ctx.user?._id);

        return {
            status: "success",
            data: {
                message: "Platform disconnected successfully.",
            },
        };
    }

    async createPostHandler(
        input: { post: IProject },
        user_id: Types.ObjectId,
    ): Promise<IProjectPlatform> {
        const platform = await super.getPlatform(user_id);

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found. Please connect your Ghost account to continue.",
            });
        }

        const tags =
            input.post.tags?.ghost_tags &&
            input.post.tags?.ghost_tags.map(tag => {
                return {
                    name: tag.name,
                };
            });

        const newPost = await super.publishPost(
            {
                html: input.post.body?.html,
                title: input.post.title ?? input.post.name,
                canonical_url: input.post.canonical_url,
                status: platform.status,
                tags: tags ?? undefined,
            },
            user_id,
        );

        return {
            name: constants.user.platforms.GHOST,
            status: newPost?.success
                ? constants.project.platformPublishStatuses.SUCCESS
                : constants.project.platformPublishStatuses.ERROR,
            published_url: newPost?.success ? newPost?.data.url : undefined,
            id: newPost?.success ? newPost?.data.id : undefined,
        };
    }

    async updatePostHandler(
        input: { post: IProject; post_id: string },
        user_id: Types.ObjectId | undefined,
    ) {
        const platform = await super.getPlatform(user_id);

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found. Please connect your Ghost account to continue.",
            });
        }

        const tags =
            input.post.tags?.ghost_tags &&
            input.post.tags?.ghost_tags.map(tag => {
                return {
                    name: tag.name,
                };
            });

        const post = await super.getPost(input.post_id, user_id);

        const updatedPost = await (post?.success
            ? super.updatePost(
                  {
                      html: input.post.body?.html,
                      title: input.post.title,
                      canonical_url: input.post.canonical_url,
                      status: platform.status,
                      tags: tags ?? undefined,
                      updated_at: new Date(post.data.updated_at ?? Date.now()),
                  },
                  input.post_id,
                  user_id,
              )
            : super.updatePost(
                  {
                      html: input.post.body?.html,
                      title: input.post.title,
                      canonical_url: input.post.canonical_url,
                      status: platform.status,
                      tags: tags ?? undefined,
                      updated_at: new Date(),
                  },
                  input.post_id,
                  user_id,
              ));

        return {
            status: "success",
            data: {
                post: updatedPost,
            },
        };
    }
}
