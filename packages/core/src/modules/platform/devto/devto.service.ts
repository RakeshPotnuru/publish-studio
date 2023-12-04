import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../config/constants";
import { decryptField } from "../../../utils/aws/kms";
import User from "../../user/user.model";
import Platform from "../platform.model";
import DevTo from "./devto.model";
import type {
    IDevTo,
    IDevToCreatePostInput,
    IDevToCreatePostOutput,
    IDevToUpdatePost,
    IDevToUserOutput,
    IDevToUserUpdate,
} from "./devto.types";

export default class DevToService {
    private readonly PLATFORM = constants.user.platforms.DEVTO;

    private async devTo(user_id: Types.ObjectId | undefined) {
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

    async createPlatform(user: IDevTo) {
        try {
            const newPlatform = await DevTo.create(user);

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

            return newPlatform as IDevTo;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the platform. Please try again later.",
            });
        }
    }

    async updatePlatform(user: IDevToUserUpdate, user_id: Types.ObjectId | undefined) {
        try {
            return (await DevTo.findOneAndUpdate({ user_id }, user, {
                new: true,
            }).exec()) as IDevTo;
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

            return (await DevTo.findOneAndDelete({ user_id }).exec()) as IDevTo;
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
            return (await DevTo.findOne({ user_id }).exec()) as IDevTo;
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
    async getDevUser(api_key: string) {
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
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async publishPost(post: IDevToCreatePostInput, user_id: Types.ObjectId | undefined) {
        try {
            const devTo = await this.devTo(user_id);

            const response = await devTo?.post("/articles", {
                article: post,
            });

            return response?.data as IDevToCreatePostOutput;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while publishing the post to Dev.to. Please try again later.",
            });
        }
    }

    async updatePost(post: IDevToUpdatePost, post_id: number, user_id: Types.ObjectId | undefined) {
        try {
            const devTo = await this.devTo(user_id);

            const response = await devTo?.put(`/articles/${post_id}`, {
                article: post,
            });

            return response?.data as IDevToCreatePostOutput;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while updating the post on Dev.to. Please try again later.",
            });
        }
    }
}
