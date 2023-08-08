import { TRPCError } from "@trpc/server";

import defaultConfig from "../../../config/app.config";
import type { Context } from "../../../trpc";
import MediumService from "./medium.service";
import type { IMediumCreatePostInput } from "./medium.types";

export default class MediumController extends MediumService {
    async createUserHandler(input: { api_key: string }, ctx: Context) {
        try {
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

            const newUser = await super.createUser({
                user_id: ctx.user?._id,
                api_key: input.api_key,
                username: user.username,
                profile_pic: user.image_url,
                author_id: user.id,
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

    async updateUserHandler(input: { api_key: string }, ctx: Context) {
        try {
            const user = await super.getMediumUser(input.api_key);
            if (!user) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid API key",
                });
            }

            const updatedUser = await super.updateUser(
                {
                    api_key: input.api_key,
                    username: user.username,
                    profile_pic: user.image_url,
                    author_id: user.id,
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

    async createPostHandler(input: { post: IMediumCreatePostInput }, ctx: Context) {
        try {
            const user = await super.getUserById(ctx.user?._id);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Account not found. Please connect your Medium account to continue.",
                });
            }

            const newPost = await super.publishPost(input.post, user.author_id);

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
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while publishing the post.",
            });
        }
    }
}
