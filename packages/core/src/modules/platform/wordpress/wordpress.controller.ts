import { TRPCError } from "@trpc/server";

import type { Context } from "../../../trpc";
import WordPressService from "./wordpress.service";
import type { IWordPressUserUpdate } from "./wordpress.types";

export default class WordPressController extends WordPressService {
    async createPlatformHandler(code: string, ctx: Context) {
        const site = await super.getWordPressSite(code);

        const newPlatform = super.createPlatform({
            user_id: ctx.user?._id,
            blog_url: site.blog_url,
            blog_id: site.blog_id,
            token: site.access_token,
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
                message: "Platform disconnected successfully.",
            },
        };
    }
}
