import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../config/constants";
import type { Context } from "../../../trpc";
import { encryptField } from "../../../utils/aws/kms";
import type { IPublishResponse } from "../../project/project.helpers";
import type { IProject } from "../../project/project.types";
import DevToService from "./devto.service";

export default class DevToController extends DevToService {
    async createPlatformHandler(
        input: { api_key: string; default_publish_status: boolean },
        ctx: Context,
    ) {
        const user = await super.getDevUser(input.api_key);

        if (user.error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }

        const newPlatform = await super.createPlatform({
            user_id: ctx.user?._id,
            api_key: input.api_key,
            username: user.username,
            profile_pic: user.profile_image,
            default_publish_status: input.default_publish_status,
        });

        return {
            status: "success",
            data: {
                platform: newPlatform,
            },
        };
    }

    async updatePlatformHandler(
        input: { api_key?: string; default_publish_status: boolean },
        ctx: Context,
    ) {
        if (input.api_key) {
            const user = await super.getDevUser(input.api_key);

            if (user.error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: defaultConfig.defaultErrorMessage,
                });
            }

            input.api_key = await encryptField(input.api_key);

            const updatedPlatform = await super.updatePlatform(
                {
                    api_key: input.api_key,
                    username: user.username,
                    profile_pic: user.profile_image,
                    default_publish_status: input.default_publish_status,
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
                default_publish_status: input.default_publish_status,
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

    async createPostHandler(input: { post: IProject }, user_id: Types.ObjectId) {
        const platform = await super.getPlatform(user_id);

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found. Please connect your Dev.to account to continue.",
            });
        }

        const newPost = await super.publishPost(
            {
                title: input.post.title,
                body_markdown: input.post.body?.markdown,
                description: input.post.description,
                published: platform.default_publish_status,
                canonical_url: input.post.canonical_url,
                tags: input.post.tags?.devto_tags,
                main_image: input.post.cover_image,
            },
            user_id,
        );

        return {
            name: constants.user.platforms.DEVTO,
            status: newPost.error ? "error" : "success",
            published_url: newPost.url,
            id: newPost.id?.toString(),
        } as IPublishResponse;
    }

    async updatePostHandler(
        input: { post: IProject; post_id: number },
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
                published: platform.default_publish_status,
                canonical_url: input.post.canonical_url,
                tags: input.post.tags?.devto_tags,
                main_image: input.post.cover_image,
            },
            input.post_id,
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
