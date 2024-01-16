import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../config/constants";
import type { Context } from "../../../trpc";
import { encryptField } from "../../../utils/aws/kms";
import type { IProject, IProjectPlatform } from "../../project/project.types";
import MediumService from "./medium.service";
import type { TMediumStatus } from "./medium.types";

export default class MediumController extends MediumService {
    async createUserHandler(
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

        if (platform) {
            await super.deletePlatform(platform.user_id);
        }

        const newPlatform = await super.createPlatform({
            user_id: ctx.user._id,
            api_key: input.api_key,
            username: user.username,
            profile_pic: user.image_url,
            author_id: user.id,
            status: input.status,
            notify_followers: input.notify_followers,
        });

        return {
            status: "success",
            data: {
                platform: newPlatform,
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

            if (platform) {
                await super.deletePlatform(platform.user_id);
            }

            input.api_key = await encryptField(input.api_key);

            const updatedPlatform = await super.updatePlatform(
                {
                    api_key: input.api_key,
                    username: user.username,
                    profile_pic: user.image_url,
                    author_id: user.id,
                    status: input.status,
                    notify_followers: input.notify_followers,
                },
                ctx.user._id,
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
                notify_followers: input.notify_followers,
            },
            ctx.user._id,
        );

        return {
            status: "success",
            data: {
                platform: updatedPlatform,
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
    ): Promise<IProjectPlatform> {
        const user = await super.getPlatform(user_id);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Account not found. Please connect your Medium account to continue.",
            });
        }

        const newPost = await super.publishPost(
            {
                title: input.post.title ?? input.post.name,
                contentFormat: "markdown",
                content: input.post.body?.markdown,
                tags: input.post.tags?.medium_tags,
                publishStatus: user.status,
                canonicalUrl: input.post.canonical_url,
            },
            user.author_id,
            user_id,
        );

        if (newPost.isError || !newPost.data) {
            return {
                name: constants.user.platforms.MEDIUM,
                status: constants.project.platformPublishStatuses.ERROR,
            };
        }

        return {
            name: constants.user.platforms.MEDIUM,
            status: constants.project.platformPublishStatuses.SUCCESS,
            published_url: newPost.data.url,
            id: newPost.data.id,
        };
    }
}
