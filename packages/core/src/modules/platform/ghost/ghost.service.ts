import { TRPCError } from "@trpc/server";
import { TSGhostAdminAPI } from "@ts-ghost/admin-api";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { Platform } from "../../../config/constants";
import PlatformModel from "../../../modules/platform/platform.model";
import User from "../../../modules/user/user.model";
import type { IPaginationOptions } from "../../../types/common.types";
import { logtail } from "../../../utils/logtail";
import Ghost from "./ghost.model";
import type {
    IGhost,
    IGhostCreatePostInput,
    IGhostUpdatePostOutput,
    TGhostCreateInput,
    TGhostUpdateInput,
    TGhostUpdatePostInput,
} from "./ghost.types";

export default class GhostService {
    private readonly PLATFORM = Platform.GHOST;
    private readonly GHOST_API_VERSION = "v5.72.1";

    private async ghost(user_id: Types.ObjectId) {
        const platform = await Ghost.findOne({ user_id }).exec();

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found",
            });
        }

        try {
            return new TSGhostAdminAPI(
                platform.api_url,
                platform.admin_api_key,
                this.GHOST_API_VERSION,
            );
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async createPlatform(platform: TGhostCreateInput): Promise<boolean> {
        try {
            const newPlatform = await Ghost.create(platform);

            await User.findByIdAndUpdate(platform.user_id, {
                $push: {
                    platforms: this.PLATFORM,
                },
            }).exec();

            await PlatformModel.create({
                user_id: platform.user_id,
                name: this.PLATFORM,
                data: newPlatform._id,
            });

            return true;
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id: platform.user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the platform. Please try again later.",
            });
        }
    }

    async updatePlatform(platform: TGhostUpdateInput, user_id: Types.ObjectId): Promise<boolean> {
        try {
            const doc = await Ghost.findOne({ user_id }).exec();

            if (!doc) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Platform not found",
                });
            }

            doc.set(platform);
            await doc.save();

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the platform. Please try again later.",
            });
        }
    }

    async deletePlatform(user_id: Types.ObjectId): Promise<boolean> {
        try {
            await PlatformModel.findOneAndDelete({
                user_id,
                name: this.PLATFORM,
            }).exec();

            await User.findByIdAndUpdate(user_id, {
                $pull: {
                    platforms: this.PLATFORM,
                },
            }).exec();

            await Ghost.findOneAndDelete({ user_id }).exec();

            return true;
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while disconnecting the platform. Please try again later.",
            });
        }
    }

    async getPlatform(user_id: Types.ObjectId): Promise<IGhost | null> {
        try {
            return await Ghost.findOne({ user_id }).exec();
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    async getPlatformByAPIUrl(api_url: string, user_id: Types.ObjectId): Promise<IGhost | null> {
        try {
            return await Ghost.findOne({ api_url }).exec();
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    async getPost(post_id: string, user_id: Types.ObjectId) {
        const ghost = await this.ghost(user_id);

        return await ghost.posts.read({ id: post_id }).fetch();
    }

    /* This method is used exactly twice before creating or updating site in `GhostController()` class
    to check if the site exists or not. That's why api key is being used directly. */
    async getGhostSite(user_id: Types.ObjectId, api_url: string, admin_api_key?: string) {
        try {
            if (!admin_api_key) {
                return {
                    success: false,
                };
            }

            const ghost = new TSGhostAdminAPI(api_url, admin_api_key, this.GHOST_API_VERSION);

            return await ghost.site.fetch();
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while fetching the site. Make sure all the details are correct and try again.",
            });
        }
    }

    async publishPost(post: IGhostCreatePostInput, user_id: Types.ObjectId) {
        const ghost = await this.ghost(user_id);

        return await ghost.posts.add({ ...post }, { source: "html" });
    }

    async updatePost(
        post: TGhostUpdatePostInput,
        post_id: string,
        user_id: Types.ObjectId,
    ): Promise<IGhostUpdatePostOutput> {
        const ghost = await this.ghost(user_id);

        const response = await ghost.posts.edit(post_id, { ...post }, { source: "html" });

        if (!response.success) {
            return {
                isError: true,
            };
        }

        return {
            isError: false,
        };
    }

    async getAllPosts(pagination: IPaginationOptions, user_id: Types.ObjectId) {
        const ghost = await this.ghost(user_id);

        const response = await ghost.posts.browse(pagination).fetch();

        if (!response.success) {
            await logtail.error(JSON.stringify(response), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the posts. Please try again later.",
            });
        }

        return response.data;
    }
}
