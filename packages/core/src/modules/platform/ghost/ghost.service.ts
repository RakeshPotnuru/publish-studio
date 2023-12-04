import { TRPCError } from "@trpc/server";
import { TSGhostAdminAPI } from "@ts-ghost/admin-api";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../config/constants";
import Platform from "../../../modules/platform/platform.model";
import User from "../../../modules/user/user.model";
import { decryptField } from "../../../utils/aws/kms";
import Ghost from "./ghost.model";
import type { IGhost, IGhostPostInput, TGhostPostUpdate, TGhostUpdate } from "./ghost.types";

export default class GhostService {
    private readonly PLATFORM = constants.user.platforms.GHOST;

    private async ghost(user_id: Types.ObjectId | undefined) {
        try {
            const platform = await this.getPlatform(user_id);

            if (!platform) {
                return;
            }

            const decryptedAPIKey = await decryptField(platform.admin_api_key);

            return new TSGhostAdminAPI(platform.api_url, decryptedAPIKey, platform.ghost_version);
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async createPlatform(platform: IGhost) {
        try {
            const newPlatform = await Ghost.create(platform);

            await User.findByIdAndUpdate(platform.user_id, {
                $push: {
                    platforms: this.PLATFORM,
                },
            }).exec();

            await Platform.create({
                user_id: platform.user_id,
                name: this.PLATFORM,
                data: newPlatform._id,
            });

            return newPlatform as IGhost;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the platform. Please try again later.",
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
    async getGhostSite(api_url: string, ghost_version: `v5.${string}`, admin_api_key?: string) {
        try {
            if (!admin_api_key) {
                return {
                    success: false,
                };
            }

            const ghost = new TSGhostAdminAPI(api_url, admin_api_key, ghost_version);

            return await ghost.site.fetch();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while fetching the site. Make sure all the details are correct and try again.",
            });
        }
    }
}
