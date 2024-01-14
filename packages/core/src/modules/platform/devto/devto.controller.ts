import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { constants } from "../../../config/constants";
import type { Context } from "../../../trpc";
import { encryptField } from "../../../utils/aws/kms";
import type { IProject, IProjectPlatform } from "../../project/project.types";
import DevToService from "./devto.service";

export default class DevToController extends DevToService {
    async createPlatformHandler(input: { api_key: string; status: boolean }, ctx: Context) {
        const user = await super.getDevUser(input.api_key);

        const platform = await super.getPlatformByUsername(user.username);

        if (platform) {
            await super.deletePlatform(platform.user_id);
        }

        const newPlatform = await super.createPlatform({
            user_id: ctx.user?._id,
            api_key: input.api_key,
            username: user.username,
            profile_pic: user.profile_image,
            status: input.status,
        });

        return {
            status: "success",
            data: {
                platform: newPlatform,
            },
        };
    }

    async updatePlatformHandler(input: { api_key?: string; status?: boolean }, ctx: Context) {
        if (input.api_key) {
            const user = await super.getDevUser(input.api_key);

            const platform = await super.getPlatformByUsername(user.username);

            if (platform) {
                await super.deletePlatform(platform.user_id);
            }

            input.api_key = await encryptField(input.api_key);

            const updatedPlatform = await super.updatePlatform(
                {
                    api_key: input.api_key,
                    username: user.username,
                    profile_pic: user.profile_image,
                    status: input.status,
                },
                ctx.user?._id,
            );

            return {
                status: "success",
                data: {
                    platform: updatedPlatform,
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
                platform: updatedPlatform,
            },
        };
    }

    async deletePlatformHandler(ctx: Context) {
        const platform = await super.getPlatform(ctx.user?._id);

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Account not found. Please connect your Dev.to account to continue.",
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
                message: "Platform not found. Please connect your Dev.to account to continue.",
            });
        }

        const newPost = await super.publishPost(
            {
                title: input.post.title ?? input.post.name,
                body_markdown: input.post.body?.markdown,
                description: input.post.description,
                published: platform.status,
                canonical_url: input.post.canonical_url,
                tags: input.post.tags?.devto_tags,
                main_image: input.post.cover_image,
            },
            user_id,
        );

        if (newPost.isError || !newPost.url || !newPost.id) {
            return {
                name: constants.user.platforms.DEVTO,
                status: constants.project.platformPublishStatuses.ERROR,
            };
        }

        return {
            name: constants.user.platforms.DEVTO,
            status: constants.project.platformPublishStatuses.SUCCESS,
            published_url: newPost.url,
            id: newPost.id.toString(),
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
                message: "Account not found. Please connect your Dev.to account to continue.",
            });
        }

        const updatedPost = await super.updatePost(
            {
                title: input.post.title,
                body_markdown: input.post.body?.markdown,
                description: input.post.description,
                published: platform.status,
                canonical_url: input.post.canonical_url,
                tags: input.post.tags?.devto_tags,
                main_image: input.post.cover_image,
            },
            Number.parseInt(input.post_id),
            user_id,
        );

        return {
            status: "success",
            data: {
                post: updatedPost,
            },
        };
    }
}
