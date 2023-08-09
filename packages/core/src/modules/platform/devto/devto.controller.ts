import { TRPCError } from "@trpc/server";

import defaultConfig from "../../../config/app.config";
import type { Context } from "../../../trpc";
import type { IProject } from "../../project/project.types";
import DevToService from "./devto.service";

export default class DevToController extends DevToService {
    async createUserHandler(
        input: { api_key: string; default_publish_status: boolean },
        ctx: Context,
    ) {
        try {
            const user = await super.getDevUser(input.api_key);

            if (user.error) {
                if (user.status === 401) {
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

            const newUser = await super.createUser({
                user_id: ctx.user?._id,
                api_key: input.api_key,
                username: user.data.username,
                profile_pic: user.data.profile_image,
                default_publish_status: input.default_publish_status,
            });

            return {
                status: "success",
                data: {
                    user: newUser,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the account.",
            });
        }
    }

    async updateUserHandler(
        input: { api_key?: string; default_publish_status?: boolean },
        ctx: Context,
    ) {
        try {
            if (input.api_key) {
                const user = await super.getDevUser(input.api_key);
                if (!user) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Invalid API key",
                    });
                }

                const updatedUser = await super.updateUser(
                    {
                        api_key: input.api_key,
                        username: user.data.username,
                        profile_pic: user.data.profile_image,
                        default_publish_status: input.default_publish_status,
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

            const updatedUser = await super.updateUser(
                {
                    default_publish_status: input.default_publish_status,
                },
                ctx.user?._id,
            );

            return {
                status: "success",
                data: {
                    user: updatedUser,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the account.",
            });
        }
    }

    async deleteUserHandler(ctx: Context) {
        try {
            const user = await super.getUserById(ctx.user?._id);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Account not found. Please connect your Dev.to account to continue.",
                });
            }

            const deletedUser = await super.deleteUser(ctx.user?._id);

            return {
                status: "success",
                data: {
                    user: deletedUser,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while deleting the account.",
            });
        }
    }

    async createPostHandler(input: { post: IProject }, ctx: Context) {
        try {
            const user = await super.getUserById(ctx.user?._id);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Account not found. Please connect your Dev.to account to continue.",
                });
            }

            const newPost = await super.publishPost({
                title: input.post.title,
                body_markdown: input.post.body,
                description: input.post.description,
                published: user.default_publish_status,
                canonical_url: input.post.canonical_url,
                tags: input.post.tags,
                main_image: input.post.cover_image,
            });

            if (newPost.error) {
                if (newPost.status === 422) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Invalid fields",
                    });
                }

                if (newPost.status === 401) {
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

            return {
                status: "success",
                data: {
                    post: newPost,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while publishing the post to Dev.to.",
            });
        }
    }
}
