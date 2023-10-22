import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../constants";
import { decryptField } from "../../../utils/aws/kms";
import User from "../../user/user.model";
import Platform from "../platform.model";
import Medium from "./medium.model";
import type {
    IMedium,
    IMediumCreatePostInput,
    IMediumCreatePostOutput,
    IMediumUserOutput,
    IMediumUserUpdate,
} from "./medium.types";

export default class MediumService {
    private readonly PLATFORM = constants.user.platforms.MEDIUM;

    private async medium(user_id: Types.ObjectId | undefined) {
        try {
            const user = await this.getUserById(user_id);

            if (!user) {
                return;
            }

            const decryptedAPIKey = await decryptField(user.api_key);

            return axios.create({
                baseURL: defaultConfig.medium_api_url,
                timeout: 10_000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${decryptedAPIKey}`,
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

    async createPlatform(user: IMedium) {
        try {
            const newPlatform = await Medium.create(user);

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

            return newPlatform as IMedium;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the account. Please try again later.",
            });
        }
    }

    async updatePlatform(user: IMediumUserUpdate, user_id: Types.ObjectId | undefined) {
        try {
            return (await Medium.findOneAndUpdate({ user_id }, user, {
                new: true,
            }).exec()) as IMedium;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the account. Please try again later.",
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

            return (await Medium.findOneAndDelete({ user_id }).exec()) as IMedium;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while disconnecting the account. Please try again later.",
            });
        }
    }

    async getUserById(user_id: Types.ObjectId | undefined) {
        try {
            return (await Medium.findOne({ user_id }).exec()) as IMedium;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the account. Please try again later.",
            });
        }
    }

    /* This method is used exactly twice before creating or updating user in `MediumController()` method
    to fetch user Medium details and update them in database. That's why api key is being used directly. */
    async getMediumUser(api_key: string) {
        try {
            const response = await axios.get(`${defaultConfig.medium_api_url}/me`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${api_key}`,
                },
            });

            return response.data.data as IMediumUserOutput;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async publishPost(
        post: IMediumCreatePostInput,
        author_id: string,
        user_id: Types.ObjectId | undefined,
    ) {
        try {
            const medium = await this.medium(user_id);

            const response = await medium?.post("/users/" + author_id + "/posts", post);

            return response?.data as IMediumCreatePostOutput;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
