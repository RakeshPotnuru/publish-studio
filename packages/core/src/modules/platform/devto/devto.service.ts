import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../config/constants";
import type { IPaginationOptions } from "../../../types/common.types";
import { decryptField } from "../../../utils/aws/kms";
import User from "../../user/user.model";
import Platform from "../platform.model";
import DevTo from "./devto.model";
import type {
    IDevTo,
    IDevToCreatePostInput,
    IDevToGetAllPostsOutput,
    IDevToUpdatePost,
    IDevToUpdatePostOutput,
    IDevToUserOutput,
    TDevToCreateInput,
    TDevToCreatePostOutput,
    TDevToUpdateInput,
} from "./devto.types";

export default class DevToService {
    private readonly PLATFORM = constants.user.platforms.DEVTO;

    private async devTo(user_id: Types.ObjectId) {
        try {
            const platform = await this.getPlatform(user_id);

            if (!platform) {
                return;
            }

            const decryptedAPIKey = await decryptField(platform.api_key);

            return axios.create({
                baseURL: defaultConfig.devto_api_url,
                timeout: 10_000,
                headers: {
                    "Content-Type": "application/json",
                    "api-key": decryptedAPIKey,
                },
            });
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async createPlatform(platform: TDevToCreateInput): Promise<IDevTo> {
        try {
            const newPlatform = await DevTo.create(platform);

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

            return newPlatform;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the platform. Please try again later.",
            });
        }
    }

    async updatePlatform(
        platform: TDevToUpdateInput,
        user_id: Types.ObjectId,
    ): Promise<IDevTo | null> {
        try {
            return await DevTo.findOneAndUpdate({ user_id }, platform, {
                new: true,
            }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the platform. Please try again later.",
            });
        }
    }

    async deletePlatform(user_id: Types.ObjectId): Promise<IDevTo | null> {
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

            return await DevTo.findOneAndDelete({ user_id }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while disconnecting the platform. Please try again later.",
            });
        }
    }

    async getPlatform(user_id: Types.ObjectId): Promise<IDevTo | null> {
        try {
            return await DevTo.findOne({ user_id }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    async getPlatformByUsername(username: string): Promise<IDevTo | null> {
        try {
            return await DevTo.findOne({ username }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    /* This method is used exactly twice before creating or updating user in `DevController()` class
    to fetch user Dev.to details and update them in database. That's why api key is being used directly. */
    async getDevUser(api_key: string): Promise<IDevToUserOutput> {
        try {
            const response = await axios.get(`${defaultConfig.devto_api_url}/users/me`, {
                headers: {
                    "api-key": api_key,
                },
            });

            return response.data as IDevToUserOutput;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid API key",
            });
        }
    }

    async publishPost(
        post: IDevToCreatePostInput,
        user_id: Types.ObjectId,
    ): Promise<TDevToCreatePostOutput> {
        try {
            const devTo = await this.devTo(user_id);

            const response = await devTo?.post("/articles", {
                article: post,
            });

            return response?.data as TDevToCreatePostOutput;
        } catch (error) {
            console.log(error);

            return { isError: true };
        }
    }

    async updatePost(
        post: IDevToUpdatePost,
        user_id: Types.ObjectId,
    ): Promise<IDevToUpdatePostOutput> {
        try {
            const devTo = await this.devTo(user_id);

            const response = await devTo?.put(`/articles/${post.post_id}`, {
                article: post,
            });

            return response?.data as IDevToUpdatePostOutput;
        } catch (error) {
            console.log(error);

            return { isError: true };
        }
    }

    async getAllPosts(
        pagination: IPaginationOptions,
        user_id: Types.ObjectId,
    ): Promise<IDevToGetAllPostsOutput[]> {
        try {
            const devTo = await this.devTo(user_id);

            const response = await devTo?.get(
                `/articles/me/all?page=${pagination.page}&per_page=${pagination.limit}`,
            );

            return response?.data as IDevToGetAllPostsOutput[];
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching posts. Please try again later.",
            });
        }
    }
}
