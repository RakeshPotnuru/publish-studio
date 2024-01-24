import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { constants } from "../../../config/constants";
import type { Context } from "../../../trpc";
import type { IPaginationOptions } from "../../../types/common.types";
import type { IProject, IProjectPlatform } from "../../project/project.types";
import GhostService from "./ghost.service";
import type { TGhostCreateFormInput, TGhostUpdateInput } from "./ghost.types";

export default class GhostController extends GhostService {
    async createPlatformHandler(input: TGhostCreateFormInput, ctx: Context) {
        const site = await super.getGhostSite(input.api_url, input.admin_api_key);

        if (!site.success) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Invalid fields. Site not found.",
            });
        }

        const platform = await super.getPlatformByAPIUrl(input.api_url);

        if (platform && !platform.user_id.equals(ctx.user._id)) {
            await super.deletePlatform(platform.user_id);
        }

        await super.createPlatform({
            user_id: ctx.user._id,
            api_url: input.api_url,
            admin_api_key: input.admin_api_key,
            status: input.status,
        });

        return {
            status: "success",
            data: {
                message: "Platform connected successfully.",
            },
        };
    }

    async updatePlatformHandler(input: TGhostUpdateInput, ctx: Context) {
        if (input.admin_api_key && input.api_url) {
            const site = await super.getGhostSite(input.api_url, input.admin_api_key);

            if (!site.success) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invalid fields. Site not found.",
                });
            }

            const platform = await super.getPlatformByAPIUrl(input.api_url);

            if (platform && !platform.user_id.equals(ctx.user._id)) {
                await super.deletePlatform(platform.user_id);
            }

            await super.updatePlatform(
                {
                    api_url: input.api_url,
                    admin_api_key: input.admin_api_key,
                    status: input.status,
                },
                ctx.user._id,
            );

            return {
                status: "success",
                data: {
                    message: "Platform connected successfully.",
                },
            };
        }

        await super.updatePlatform(
            {
                status: input.status,
            },
            ctx.user._id,
        );

        return {
            status: "success",
            data: {
                message: "Platform updated successfully.",
            },
        };
    }

    async deletePlatformHandler(ctx: Context) {
        const platform = await super.getPlatform(ctx.user._id);

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found.",
            });
        }

        await super.deletePlatform(ctx.user._id);

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

        const { post } = input;

        const tags =
            post.tags?.ghost_tags &&
            post.tags?.ghost_tags.map(tag => {
                return {
                    name: tag.name,
                };
            });

        const newPost = await super.publishPost(
            {
                html: post.body?.html,
                title: post.title ?? post.name,
                canonical_url: post.canonical_url,
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

    async updatePostHandler(input: { post: IProject; post_id: string }, user_id: Types.ObjectId) {
        const platform = await super.getPlatform(user_id);

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found. Please connect your Ghost account to continue.",
            });
        }

        const { post, post_id } = input;

        const tags =
            post.tags?.ghost_tags &&
            post.tags?.ghost_tags.map(tag => {
                return {
                    name: tag.name,
                };
            });

        const existingPost = await super.getPost(post_id, user_id);

        const updatedPost = await (existingPost?.success
            ? super.updatePost(
                  {
                      post_id: post_id,
                      html: post.body?.html,
                      title: post.title,
                      canonical_url: post.canonical_url,
                      status: platform.status,
                      tags: tags ?? undefined,
                      updated_at: new Date(existingPost.data.updated_at ?? Date.now()),
                  },
                  user_id,
              )
            : super.updatePost(
                  {
                      post_id: post_id,
                      html: post.body?.html,
                      title: post.title,
                      canonical_url: post.canonical_url,
                      status: platform.status,
                      tags: tags ?? undefined,
                      updated_at: new Date(),
                  },
                  user_id,
              ));

        return {
            status: "success",
            data: {
                post: updatedPost,
            },
        };
    }

    async getAllPostsHandler(input: { pagination: IPaginationOptions }, ctx: Context) {
        const posts = await super.getAllPosts(input.pagination, ctx.user._id);

        return {
            status: "success",
            data: {
                posts,
            },
        };
    }
}
