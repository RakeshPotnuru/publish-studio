import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { decryptField } from "../../../utils/aws/kms";
import { user as userConsts } from "../../../utils/constants";
import User from "../../user/user.model";
import Platform from "../platform.model";
import DevTo from "./devto.model";
import type {
    IDevTo,
    IDevToCreatePostInput,
    IDevToCreatePostOutput,
    IDevToUserOutput,
    IDevToUserUpdate,
} from "./devto.types";

export default class DevToService {
    private readonly PLATFORM = userConsts.platforms.DEVTO;

    private async devTo(user_id: Types.ObjectId | undefined) {
        try {
            const user = await this.getPlatformById(user_id);

            if (!user) {
                return;
            }

            const decryptedAPIKey = await decryptField(user.api_key);

            return axios.create({
                baseURL: defaultConfig.devto_api_url,
                timeout: 10_000,
                headers: {
                    "Content-Type": "application/json",
                    "api-key": decryptedAPIKey,
                },
            });
        } catch (error) {
            console.error(error);

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
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the account. Please try again later.",
            });
        }
    }

    async updatePlatform(user: IDevToUserUpdate, user_id: Types.ObjectId | undefined) {
        try {
            return (await DevTo.findOneAndUpdate({ user_id }, user, {
                new: true,
            }).exec()) as IDevTo;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the account. Please try again later.",
            });
        }
    }

    async deletePlatform(user_id: Types.ObjectId | undefined) {
        try {
            await Platform.findOneAndDelete({ user_id }).exec();

            await User.findByIdAndUpdate(user_id, {
                $pull: {
                    platforms: this.PLATFORM,
                },
            }).exec();

            return (await DevTo.findOneAndDelete({ user_id }).exec()) as IDevTo;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while disconnecting the account. Please try again later.",
            });
        }
    }

    async getPlatformById(user_id: Types.ObjectId | undefined) {
        try {
            return (await DevTo.findOne({ user_id }).exec()) as IDevTo;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the account. Please try again later.",
            });
        }
    }

    /* This method is used exactly twice before creating or updating user user in `DevController()` class
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
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async publishPost(post: IDevToCreatePostInput, user_id: Types.ObjectId | undefined) {
        try {
            const devTo = await this.devTo(user_id);

            const response = await devTo?.post("/articles", post);

            return response?.data as IDevToCreatePostOutput;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while publishing the post to Dev.to. Please try again later.",
            });
        }
    }
}
