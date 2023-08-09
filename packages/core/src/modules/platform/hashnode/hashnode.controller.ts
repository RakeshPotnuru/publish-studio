import { TRPCError } from "@trpc/server";

import defaultConfig from "../../../config/app.config";
import type { Context } from "../../../trpc";
import type { IProject } from "../../project/project.types";
import HashnodeService from "./hashnode.service";

export default class HashnodeController extends HashnodeService {
    async getUserHandler(input: { username: string }) {
        try {
            const user = await super.getHashnodeUser(input.username);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found. Correct your username and try again.",
                });
            }

            return {
                status: "success",
                data: {
                    user: user,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async createUserHandler(input: { username: string; api_key: string }, ctx: Context) {
        try {
            const { username, api_key } = input;

            const user = await super.getHashnodeUser(username);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Account not found. Correct your username and try again.",
                });
            }

            const newUser = await super.createUser({
                user_id: ctx.user?._id,
                api_key: api_key,
                username,
                profile_pic: user.photo,
                blog_handle: user.blogHandle,
                publication: {
                    publication_id: user.publication._id,
                    publication_logo: user.publication.favicon,
                },
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

    async updateUserHandler(input: { username: string; api_key?: string }, ctx: Context) {
        try {
            const user = await super.getHashnodeUser(input.username);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found. Correct your username and try again.",
                });
            }

            if (input.api_key) {
                const updatedUser = await super.updateUser(
                    {
                        api_key: input.api_key,
                        username: input.username,
                        profile_pic: user.photo,
                        blog_handle: user.blogHandle,
                        publication: {
                            publication_id: user.publication._id,
                            publication_logo: user.publication.favicon,
                        },
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
                    username: input.username,
                    profile_pic: user.photo,
                    blog_handle: user.blogHandle,
                    publication: {
                        publication_id: user.publication._id,
                        publication_logo: user.publication.favicon,
                    },
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
                    message: "Account not found. Please connect your Hashnode account to continue.",
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

    async createPostHandler(
        input: {
            post: IProject;
        },
        ctx: Context,
    ) {
        try {
            const user = await super.getUserById(ctx.user?._id);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Account not found. Please connect your Hashnode account to continue.",
                });
            }

            const { post } = input;

            const newPost = await super.publishPost({
                title: post.title,
                contentMarkdown: post.body,
                // TODO: Fetch tags info from hashnode
                // tags: post.tags,
                coverImageURL: post.cover_image,
                isRepublished: {
                    originalArticleURL: post.canonical_url,
                },
                isPartOfPublication: {
                    publicationId: user.publication.publication_id,
                },
            });

            if (newPost.errors) {
                if (newPost.errors[0].extensions.code === "INTERNAL_SERVER_ERROR") {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Invalid fields",
                    });
                }

                if (newPost.errors[0].extensions.code === "UNAUTHENTICATED") {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: newPost.errors[0].message,
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
                message: "An error occurred while publishing the post to Hashnode.",
            });
        }
    }
}
