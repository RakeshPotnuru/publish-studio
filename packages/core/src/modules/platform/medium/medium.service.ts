import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { Platform } from "../../../config/constants";
import User from "../../user/user.model";
import PlatformModel from "../platform.model";
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
    private readonly PLATFORM = Platform.MEDIUM;

    private async medium(user_id: Types.ObjectId) {
        const platform = await Medium.findOne({ user_id }).exec();

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found",
            });
        }

        try {
            return axios.create({
                baseURL: defaultConfig.mediumApiUrl,
                timeout: 10_000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${platform.api_key}`,
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

    async createPlatform(user: TMediumCreateInput): Promise<boolean> {
        try {
            const newPlatform = await Medium.create(user);

            await User.findByIdAndUpdate(user.user_id, {
                $push: {
                    platforms: this.PLATFORM,
                },
            }).exec();

            await PlatformModel.create({
                user_id: user.user_id,
                name: this.PLATFORM,
                data: newPlatform._id,
            });

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the platform. Please try again later.",
            });
        }
    }

    async updatePlatform(
        platform: TMediumToUpdateInput,
        user_id: Types.ObjectId,
    ): Promise<boolean> {
        try {
            const doc = await Medium.findOne({ user_id }).exec();
            doc?.set(platform);
            await doc?.save();

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

            await Medium.findOneAndDelete({ user_id }).exec();

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while disconnecting the platform. Please try again later.",
            });
        }
    }

    async getPlatform(user_id: Types.ObjectId): Promise<Omit<IMedium, "api_key"> | null> {
        try {
            return await Medium.findOne({ user_id }).select("-api_key").exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    async getPlatformByUsername(username: string): Promise<Omit<IMedium, "api_key"> | null> {
        try {
            return await Medium.findOne({ username }).select("-api_key").exec();
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
            const response = await axios.get(`${defaultConfig.mediumApiUrl}/me`, {
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

            const response = await medium.post("/users/" + author_id + "/posts", post);

            return response.data as TMediumCreatePostOutput;
        } catch (error) {
            console.log(error);

            return { isError: true };
        }
    }
}
