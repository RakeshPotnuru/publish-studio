import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { encryptField } from "@/utils/aws/kms";

import defaultConfig from "../../../config/app.config";
import type { Context } from "../../../trpc";
import type { IProject, TTags } from "../../project/project.types";
import HashnodeService from "./hashnode.service";

export default class HashnodeController extends HashnodeService {
    async getUserHandler(input: { username: string }) {
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
    }

    async createUserHandler(input: { username: string; api_key: string }, ctx: Context) {
        const { username, api_key } = input;

        const user = await super.getHashnodeUser(username);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Account not found. Correct your username and try again.",
            });
        }

        const newUser = await super.createPlatform({
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
    }

    async updateUserHandler(input: { username: string; api_key?: string }, ctx: Context) {
        const user = await super.getHashnodeUser(input.username);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found. Correct your username and try again.",
            });
        }

        if (input.api_key) {
            input.api_key = await encryptField(input.api_key);

            const updatedUser = await super.updatePlatform(
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

        const updatedUser = await super.updatePlatform(
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
    }

    async deleteUserHandler(ctx: Context) {
        const user = await super.getPlatform(ctx.user?._id);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Account not found. Please connect your Hashnode account to continue.",
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

    async createPostHandler(
        input: {
            post: IProject;
            tags?: TTags;
        },
        user_id: Types.ObjectId,
    ) {
        const user = await super.getPlatform(user_id);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Account not found. Please connect your Hashnode account to continue.",
            });
        }

        const { post, tags } = input;

        const postBody = post.canonical_url
            ? {
                  title: post.title,
                  contentMarkdown: post.body,
                  tags: tags?.hashnode_tags,
                  coverImageURL: post.cover_image,
                  isRepublished: {
                      originalArticleURL: post.canonical_url,
                  },
                  isPartOfPublication: {
                      publicationId: user.publication.publication_id,
                  },
              }
            : {
                  title: post.title,
                  contentMarkdown: post.body,
                  tags: tags?.hashnode_tags,
                  coverImageURL: post.cover_image,
                  isPartOfPublication: {
                      publicationId: user.publication.publication_id,
                  },
              };

        const newPost = await super.publishPost(postBody, user_id);

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
    }

    async updatePostHandler(
        input: {
            post: IProject;
            tags?: TTags;
            post_id: string;
        },
        user_id: Types.ObjectId | undefined,
    ) {
        const user = await super.getPlatform(user_id);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Account not found. Please connect your Hashnode account to continue.",
            });
        }

        const { post, tags, post_id } = input;

        const postBody = post.canonical_url
            ? {
                  title: post.title,
                  contentMarkdown: post.body,
                  tags: tags?.hashnode_tags,
                  coverImageURL: post.cover_image,
                  isRepublished: {
                      originalArticleURL: post.canonical_url,
                  },
                  isPartOfPublication: {
                      publicationId: user.publication.publication_id,
                  },
              }
            : {
                  title: post.title,
                  contentMarkdown: post.body,
                  tags: tags?.hashnode_tags,
                  coverImageURL: post.cover_image,
                  isPartOfPublication: {
                      publicationId: user.publication.publication_id,
                  },
              };

        const updatedPost = await super.updatePost(postBody, post_id, user_id);

        if (updatedPost.errors) {
            if (updatedPost.errors[0].extensions.code === "INTERNAL_SERVER_ERROR") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid fields",
                });
            }

            if (updatedPost.errors[0].extensions.code === "UNAUTHENTICATED") {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: updatedPost.errors[0].message,
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
                post: updatedPost,
            },
        };
    }
}
