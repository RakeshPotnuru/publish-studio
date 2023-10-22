import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import type { Context } from "../../../trpc";
import type { IProject, TTags } from "../../project/project.types";
import MediumService from "./medium.service";
import type { default_publish_status } from "./medium.types";

export default class MediumController extends MediumService {
    async createUserHandler(
        input: {
            api_key: string;
            default_publish_status: default_publish_status;
            notify_followers: boolean;
        },
        ctx: Context,
    ) {
        const user = await super.getMediumUser(input.api_key);

        if (user.errors) {
            if (user.errors[0].code === 6000 || user.errors[0].code === 6003) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid API key",
                });
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }

        const newUser = await super.createPlatform({
            user_id: ctx.user?._id,
            api_key: input.api_key,
            username: user.username,
            profile_pic: user.image_url,
            author_id: user.id,
            default_publish_status: input.default_publish_status,
            notify_followers: input.notify_followers,
        });

        return {
            status: "success",
            data: {
                user: newUser,
            },
        };
    }

    async updateUserHandler(
        input: {
            api_key?: string;
            default_publish_status?: default_publish_status;
            notify_followers?: boolean;
        },
        ctx: Context,
    ) {
        if (input.api_key) {
            const user = await super.getMediumUser(input.api_key);
            if (!user) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid API key",
                });
            }

            const updatedUser = await super.updatePlatform(
                {
                    api_key: input.api_key,
                    username: user.username,
                    profile_pic: user.image_url,
                    author_id: user.id,
                    default_publish_status: input.default_publish_status,
                    notify_followers: input.notify_followers,
                },
                ctx.user?._id,
            );

            return {
                status: "success",
                data: {
                    user: updatedUser,
                },
            };
        }

        const updatedUser = await super.updatePlatform(
            {
                default_publish_status: input.default_publish_status,
                notify_followers: input.notify_followers,
            },
            ctx.user?._id,
        );

        return {
            status: "success",
            data: {
                user: updatedUser,
            },
        };
    }

    async deleteUserHandler(ctx: Context) {
        const user = await super.getUserById(ctx.user?._id);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Account not found. Please connect your Medium account to continue.",
            });
        }

        const deletedUser = await super.deletePlatform(ctx.user?._id);

        return {
            status: "success",
            data: {
                user: deletedUser,
            },
        };
    }

    async createPostHandler(input: { post: IProject; tags: TTags }, user_id: Types.ObjectId) {
        const user = await super.getUserById(user_id);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Account not found. Please connect your Medium account to continue.",
            });
        }

        const newPost = await super.publishPost(
            {
                title: input.post.title,
                contentFormat: "markdown",
                content: input.post.body,
                tags: input.tags.medium_tags,
                publishStatus: user.default_publish_status,
                canonicalUrl: input.post.canonical_url,
            },
            user.author_id,
            user_id,
        );

        if (newPost.errors) {
            if (newPost.errors[0].code === 6000 || newPost.errors[0].code === 6003) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid API key",
                });
            }

            if (newPost.errors[0].code === 2002) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid fields",
                });
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }

        return {
            status: "success",
            data: {
                post: newPost,
            },
        };
    }
}
