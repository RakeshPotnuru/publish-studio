import { TRPCError } from "@trpc/server";

import type { Context } from "../../../trpc";
import BloggerService from "./blogger.service";

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

    async createPlatformHandler(code: string, ctx: Context) {
        const response = await super.getTokenAndBlogs(code);

        const newPlatform = super.createPlatform({
            user_id: ctx.user?._id,
            blog_id: response.blogs?.[0].id,
            blog_url: response.blogs[0].url,
            token: response.token,
        });

        return {
            status: "success",
            data: {
                platform: newPlatform,
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

        await super.deletePlatform(ctx.user?._id);

        return {
            status: "success",
            data: {
                message: "Platform disconnected successfully.",
            },
        };
    }
}
