import { TRPCError } from "@trpc/server";
import { TSGhostAdminAPI } from "@ts-ghost/admin-api";
import type { Types } from "mongoose";

import defaultConfig from "@/config/app.config";
import { constants } from "@/constants";
import Platform from "@/modules/platform/platform.model";
import User from "@/modules/user/user.model";

import Ghost from "./ghost.model";
import type { IGhost, IGhostPostInput, TGhostPostUpdate, TGhostUpdate } from "./ghost.types";

export default class GhostService {
    private readonly PLATFORM = constants.user.platforms.GHOST;

    private async ghost(user_id: Types.ObjectId | undefined) {
        try {
            const user = await this.getPlatform(user_id);

            if (!user.admin_api_key) {
                return;
            }

            return new TSGhostAdminAPI(user.api_url, user.admin_api_key, user.ghost_version);
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async createPlatform(user: IGhost) {
        try {
            const newPlatform = await Ghost.create(user);

            await User.findByIdAndUpdate(user.user_id, {
                $push: {
                    platforms: this.PLATFORM,
                },
            }).exec();

            await Platform.create({
                user_id: user.user_id,
                name: this.PLATFORM,
                data: newPlatform._id,
            });

            return newPlatform as IGhost;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the platform. Please try again later.",
            });
        }
    }

    async updatePlatform(user: TGhostUpdate, user_id: Types.ObjectId | undefined) {
        try {
            return (await Ghost.findOneAndUpdate({ user_id }, user, {
                new: true,
            }).exec()) as IGhost;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the platform. Please try again later.",
            });
        }
    }

    async deletePlatform(user_id: Types.ObjectId | undefined) {
        try {
            await Platform.findOneAndDelete({
                user_id,
                name: this.PLATFORM,
            }).exec();

            await User.findByIdAndUpdate(user_id, {
                $pull: {
                    platforms: this.PLATFORM,
                },
            }).exec();

            return (await Ghost.findOneAndDelete({ user_id }).exec()) as IGhost;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while disconnecting the platform. Please try again later.",
            });
        }
    }

    async getPlatform(user_id: Types.ObjectId | undefined) {
        try {
            return (await Ghost.findOne({ user_id }).exec()) as IGhost;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    async publishPost(post: IGhostPostInput, user_id: Types.ObjectId | undefined) {
        try {
            const ghost = await this.ghost(user_id);

            return await ghost?.posts.add(post);
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while publishing the post. Please try again later.",
            });
        }
    }

    async updatePost(post: TGhostPostUpdate, post_id: string, user_id: Types.ObjectId | undefined) {
        try {
            const ghost = await this.ghost(user_id);

            return await ghost?.posts.edit(post_id, post);
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the post. Please try again later.",
            });
        }
    }

    /* This method is used exactly twice before creating or updating site in `GhostController()` class
    to check if the site exists or not. That's why api key is being used directly. */
    async getGhostSite(input: {
        api_url: string;
        admin_api_key?: string;
        ghost_version: `v5.${string}`;
    }) {
        try {
            if (!input.admin_api_key) {
                return {
                    success: false,
                };
            }

            const ghost = new TSGhostAdminAPI(
                input.api_url,
                input.admin_api_key,
                input.ghost_version,
            );

            return await ghost.site.fetch();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
