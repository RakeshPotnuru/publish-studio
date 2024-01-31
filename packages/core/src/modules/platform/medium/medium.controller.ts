import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../config/constants";
import type { Context } from "../../../trpc";
import type { TPostUpdateInput } from "../../post/post.types";
import type { IProject } from "../../project/project.types";
import MediumService from "./medium.service";
import type { TMediumStatus } from "./medium.types";

export default class MediumController extends MediumService {
    async createPlatformHandler(
        input: {
            api_key: string;
            status: TMediumStatus;
            notify_followers: boolean;
        },
        ctx: Context,
    ) {
        const user = await super.getMediumUser(input.api_key);

        if (user.errors) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }

        const platform = await super.getPlatformByUsername(user.username);

        if (platform && !platform.user_id.equals(ctx.user._id)) {
            await super.deletePlatform(platform.user_id);
        }

        await super.createPlatform({
            user_id: ctx.user._id,
            api_key: input.api_key,
            username: user.username,
            author_id: user.id,
            status: input.status,
            notify_followers: input.notify_followers,
        });

        return {
            status: "success",
            data: {
                message: "Your Medium account has been connected successfully.",
            },
        };
    }

    async updatePlatformHandler(
        input: {
            api_key?: string;
            status?: TMediumStatus;
            notify_followers?: boolean;
        },
        ctx: Context,
    ) {
        if (input.api_key) {
            const user = await super.getMediumUser(input.api_key);

            if (user.errors) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: defaultConfig.defaultErrorMessage,
                });
            }

            const platform = await super.getPlatformByUsername(user.username);

            if (platform && !platform.user_id.equals(ctx.user._id)) {
                await super.deletePlatform(platform.user_id);
            }

            await super.updatePlatform(
                {
                    api_key: input.api_key,
                    username: user.username,
                    author_id: user.id,
                    status: input.status,
                    notify_followers: input.notify_followers,
                },
                ctx.user._id,
            );

            return {
                status: "success",
                data: {
                    message: "Your Medium account has been updated successfully.",
                },
            };
        }

        await super.updatePlatform(
            {
                status: input.status,
                notify_followers: input.notify_followers,
            },
            ctx.user._id,
        );

        return {
            status: "success",
            data: {
                message: "Your Medium account has been updated successfully.",
            },
        };
    }

    async deletePlatformHandler(ctx: Context) {
        const platform = await super.getPlatform(ctx.user._id);

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Account not found. Please connect your Medium account to continue.",
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
    ): Promise<TPostUpdateInput> {
        const platform = await super.getPlatform(user_id);

        if (!platform) {
            return {
                platform: constants.user.platforms.DEVTO,
                status: constants.postStatus.ERROR,
            };
        }

        const { post } = input;

        const newPost = await super.publishPost(
            {
                title: post.title ?? post.name,
                contentFormat: "markdown",
                content: post.body?.markdown,
                tags: post.tags?.medium_tags,
                publishStatus: platform.status,
                canonicalUrl: post.canonical_url,
            },
            platform.author_id,
            user_id,
        );

        if (newPost.isError || !newPost.data) {
            return {
                platform: constants.user.platforms.DEVTO,
                status: constants.postStatus.ERROR,
            };
        }

        return {
            platform: constants.user.platforms.MEDIUM,
            status: constants.postStatus.SUCCESS,
            published_url: newPost.data.url,
            post_id: newPost.data.id,
        };
    }
}
