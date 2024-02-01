import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { Platform, PostStatus } from "../../../config/constants";
import type { Context } from "../../../trpc";
import type { TPostUpdateInput } from "../../post/post.types";
import type { IProject } from "../../project/project.types";
import BloggerService from "./blogger.service";
import type { IBloggerUpdateInput } from "./blogger.types";

export default class BloggerController extends BloggerService {
    getAuthUrlHandler() {
        const authUrl = super.getAuthUrl();

        return {
            status: "success",
            data: {
                authUrl,
            },
        };
    }

    async getBloggerBlogsHandler(ctx: Context) {
        const blogs = await super.getBloggerBlogs(ctx.user._id);

        return {
            status: "success",
            data: {
                blogs,
            },
        };
    }

    async createPlatformHandler(code: string, ctx: Context) {
        const response = await super.getTokenAndBlogs(code);

        const platform = await super.getPlatformByBlogId(response.blogs[0].id);

        if (platform && !platform.user_id.equals(ctx.user._id)) {
            await super.deletePlatform(platform.user_id);
        }

        await super.createPlatform({
            user_id: ctx.user._id,
            blog_id: response.blogs[0].id,
            blog_url: response.blogs[0].url,
            token: response.token,
            status: true,
        });

        return {
            status: "success",
            data: {
                message: "Your Blogger account has been connected successfully.",
            },
        };
    }

    async updatePlatformHandler(input: IBloggerUpdateInput, ctx: Context) {
        const platform = await super.getPlatformByBlogId(input.blog_id);

        if (platform && !platform.user_id.equals(ctx.user._id)) {
            await super.deletePlatform(platform.user_id);
        }

        await super.updatePlatform(input, ctx.user._id);

        return {
            status: "success",
            data: {
                message: "Your Blogger account has been updated successfully.",
            },
        };
    }

    async deletePlatformHandler(ctx: Context) {
        const platform = await super.getPlatform(ctx.user._id);

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Account not found. Please connect your Blogger account to continue.",
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
                platform: Platform.DEVTO,
                status: PostStatus.ERROR,
            };
        }

        const { post } = input;

        const newPost = await super.publishPost(
            {
                blogId: platform.blog_id,
                isDraft: platform.status,
                requestBody: {
                    title: post.title ?? post.name,
                    content: post.body?.html,
                    labels: post.tags?.blogger_tags,
                },
            },
            user_id,
        );

        if (newPost.statusText !== "OK") {
            return {
                platform: Platform.DEVTO,
                status: PostStatus.ERROR,
            };
        }

        return {
            platform: Platform.BLOGGER,
            status: PostStatus.SUCCESS,
            published_url: newPost.data.url ?? undefined,
            post_id: newPost.data.id ?? undefined,
        };
    }

    async updatePostHandler(input: { post: IProject; post_id: string }, user_id: Types.ObjectId) {
        const platform = await super.getPlatform(user_id);

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found. Please connect your Blogger account to continue.",
            });
        }

        const { post, post_id } = input;

        const updatedPost = await super.updatePost(
            {
                post_id: post_id,
                blogId: platform.blog_id,
                requestBody: {
                    title: post.title ?? post.name,
                    content: post.body?.html,
                    labels: post.tags?.blogger_tags,
                },
            },
            user_id,
        );

        return {
            status: "success",
            data: {
                post: updatedPost,
            },
        };
    }

    async getAllPostsHandler(
        input: {
            pagination: {
                limit: number;
                page_token?: string;
            };
        },
        ctx: Context,
    ) {
        const posts = await super.getAllPosts(input.pagination, ctx.user._id);

        return {
            status: "success",
            data: {
                posts,
            },
        };
    }
}
