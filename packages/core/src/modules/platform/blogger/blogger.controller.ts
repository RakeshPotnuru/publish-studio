import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { constants } from "../../../config/constants";
import type { Context } from "../../../trpc";
import type { IProject, IProjectPlatform } from "../../project/project.types";
import BloggerService from "./blogger.service";
import type { IBloggerUserUpdate } from "./blogger.types";

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
        const blogs = await super.getBloggerBlogs(ctx.user?._id);

        return {
            status: "success",
            data: {
                blogs,
            },
        };
    }

    async createPlatformHandler(code: string, ctx: Context) {
        const response = await super.getTokenAndBlogs(code);

        const platform = await super.getPlatformByBlogId(response.blogs?.[0].id);

        if (platform) {
            await super.deletePlatform(platform.user_id, platform.token);
        }

        const newPlatform = super.createPlatform({
            user_id: ctx.user?._id,
            blog_id: response.blogs?.[0].id,
            blog_url: response.blogs[0].url,
            token: response.token,
            status: true,
        });

        return {
            status: "success",
            data: {
                platform: newPlatform,
            },
        };
    }

    async updatePlatformHandler(input: IBloggerUserUpdate, ctx: Context) {
        const platform = await super.getPlatformByBlogId(input.blog_id);

        if (platform) {
            await super.deletePlatform(platform.user_id, platform.token);
        }

        const updatedPlatform = await super.updatePlatform(input, ctx.user?._id);

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
                message: "Account not found. Please connect your Blogger account to continue.",
            });
        }

        await super.deletePlatform(ctx.user?._id, platform.token);

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
                message: "Platform not found. Please connect your Blogger account to continue.",
            });
        }

        const newPost = await super.publishPost(
            {
                blogId: platform.blog_id,
                isDraft: platform.status,
                requestBody: {
                    title: input.post.title ?? input.post.name,
                    content: input.post.body?.html,
                    labels: input.post.tags?.blogger_tags,
                },
            },
            user_id,
        );

        return {
            name: constants.user.platforms.BLOGGER,
            status:
                newPost?.statusText === "OK"
                    ? constants.project.platformPublishStatuses.SUCCESS
                    : constants.project.platformPublishStatuses.ERROR,
            published_url: newPost?.data.url ?? undefined,
            id: newPost?.data.id ?? undefined,
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
                message: "Platform not found. Please connect your Blogger account to continue.",
            });
        }

        const updatedPost = await super.updatePost(
            {
                blogId: platform.blog_id,
                requestBody: {
                    title: input.post.title ?? input.post.name,
                    content: input.post.body?.html,
                    labels: input.post.tags?.blogger_tags,
                },
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
