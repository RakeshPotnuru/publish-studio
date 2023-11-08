import { TRPCError } from "@trpc/server";

import type { Context } from "../../../trpc";
import { encryptField } from "../../../utils/aws/kms";
import GhostService from "./ghost.service";
import type { IGhost, TGhostUpdate } from "./ghost.types";

export default class GhostController extends GhostService {
    async createPlatformHandler(input: IGhost, ctx: Context) {
        const site = await super.getGhostSite(input);

        if (!site.success) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Invalid fields. Site not found.",
            });
        }

        const newPlatform = await super.createPlatform({
            user_id: ctx.user?._id,
            api_url: input.api_url,
            admin_api_key: input.admin_api_key,
            ghost_version: input.ghost_version,
            default_publish_status: input.default_publish_status,
        });

        return {
            status: "success",
            data: {
                user: newPlatform,
            },
        };
    }

    async updatePlatformHandler(input: TGhostUpdate, ctx: Context) {
        if (input.admin_api_key) {
            const site = await super.getGhostSite(input);

            if (!site.success) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invalid fields. Site not found.",
                });
            }

            input.admin_api_key = await encryptField(input.admin_api_key);

            const updatedPlatform = await super.updatePlatform(
                {
                    api_url: input.api_url,
                    admin_api_key: input.admin_api_key,
                    ghost_version: input.ghost_version,
                    default_publish_status: input.default_publish_status,
                },
                ctx.user?._id,
            );

            return {
                status: "success",
                data: {
                    user: updatedPlatform,
                },
            };
        }

        const updatedPlatform = await super.updatePlatform(
            {
                api_url: input.api_url,
                ghost_version: input.ghost_version,
                default_publish_status: input.default_publish_status,
            },
            ctx.user?._id,
        );

        return {
            status: "success",
            data: {
                user: updatedPlatform,
            },
        };
    }

    async deletePlatformHandler(ctx: Context) {
        const user = await super.getPlatform(ctx.user?._id);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found.",
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
