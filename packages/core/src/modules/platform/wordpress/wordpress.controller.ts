import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { constants } from "../../../config/constants";
import type { Context } from "../../../trpc";
import type { IProject, IProjectPlatform } from "../../project/project.types";
import WordPressService from "./wordpress.service";
import type { IWordPressUserUpdate } from "./wordpress.types";

export default class WordPressController extends WordPressService {
    async createPlatformHandler(code: string, ctx: Context) {
        const site = await super.getWordPressSite(code);

        const platform = await super.getPlatformByBlogId(site.blog_id);

        if (platform) {
            await super.deletePlatform(platform.user_id);
        }

        const newPlatform = super.createPlatform({
            user_id: ctx.user?._id,
            blog_url: site.blog_url,
            blog_id: site.blog_id,
            token: site.access_token,
            publicize: false,
            default_publish_status: constants.wordpressStatuses.DRAFT,
        });

        return {
            status: "success",
            data: {
                platform: newPlatform,
            },
        };
    }

    async updatePlatformHandler(input: IWordPressUserUpdate, ctx: Context) {
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
                message: "Account not found. Please connect your WordPress account to continue.",
            });
        }

        await super.deletePlatform(ctx.user?._id);

        return {
            status: "success",
            data: {
                message:
                    "Platform disconnected successfully. Also, please disconnect from your connected accounts in your WordPress account.",
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
                message: "Platform not found. Please connect your WordPress account to continue.",
            });
        }

        const newPost = await super.publishPost(
            {
                title: `<h1>${input.post.title ?? input.post.name}</h1>`,
                content: input.post.body?.html,
                status: platform.default_publish_status,
                publicize: platform.publicize,
                excerpt: input.post.description,
                tags: input.post.tags?.wordpress_tags,
            },
            user_id,
        );

        if (newPost.isError || !newPost.URL || !newPost.ID) {
            return {
                name: constants.user.platforms.WORDPRESS,
                status: constants.project.platformPublishStatuses.ERROR,
            };
        }

        return {
            name: constants.user.platforms.WORDPRESS,
            status: constants.project.platformPublishStatuses.SUCCESS,
            published_url: newPost.URL,
            id: newPost.ID.toString(),
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
                message: "Platform not found. Please connect your WordPress account to continue.",
            });
        }

        const updatedPost = await super.updatePost(
            {
                title: `<h1>${input.post.title ?? "Untitled"}</h1>`,
                content: input.post.body?.html,
                status: platform.default_publish_status,
                publicize: platform.publicize,
                excerpt: input.post.description,
                tags: input.post.tags?.wordpress_tags,
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
