import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../config/constants";
import { decryptField } from "../../../utils/aws/kms";
import User from "../../user/user.model";
import Platform from "../platform.model";
import Medium from "./medium.model";
import type {
    IMedium,
    IMediumCreatePostInput,
    IMediumUserOutput,
    TMediumCreateInput,
    TMediumCreatePostOutput,
    TMediumToUpdateInput,
} from "./medium.types";

export default class MediumService {
    private readonly PLATFORM = constants.user.platforms.MEDIUM;

    private async medium(user_id: Types.ObjectId) {
        try {
            const platform = await this.getPlatform(user_id);

            if (!platform) {
                return;
            }

            const decryptedAPIKey = await decryptField(platform.api_key);

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

    async createPlatform(user: TMediumCreateInput): Promise<IMedium> {
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
        user: TMediumToUpdateInput,
        user_id: Types.ObjectId,
    ): Promise<IMedium | null> {
        try {
            return await Medium.findOneAndUpdate({ user_id }, user, {
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

    async deletePlatform(user_id: Types.ObjectId): Promise<IMedium | null> {
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

            return await Medium.findOneAndDelete({ user_id }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while disconnecting the platform. Please try again later.",
            });
        }
    }

    async getPlatform(user_id: Types.ObjectId): Promise<IMedium | null> {
        try {
            return await Medium.findOne({ user_id }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    async getPlatformByUsername(username: string): Promise<IMedium | null> {
        try {
            return await Medium.findOne({ username }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    /* This method is used exactly twice before creating or updating user in `MediumController()` method
    to fetch user Medium details and update them in database. That's why api key is being used directly. */
    async getMediumUser(api_key: string): Promise<IMediumUserOutput> {
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
                code: "UNAUTHORIZED",
                message: "Invalid API key",
            });
        }
    }

    async publishPost(
        post: IMediumCreatePostInput,
        author_id: string,
        user_id: Types.ObjectId,
    ): Promise<TMediumCreatePostOutput> {
        try {
            const medium = await this.medium(user_id);

            const response = await medium?.post("/users/" + author_id + "/posts", post);

            return response?.data as TMediumCreatePostOutput;
        } catch (error) {
            console.log(error);

            return { isError: true };
        }
    }
}
