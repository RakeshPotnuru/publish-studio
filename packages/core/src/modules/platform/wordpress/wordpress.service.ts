import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";
import WPAPI from "wpapi";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../constants";
import Platform from "../../../modules/platform/platform.model";
import User from "../../../modules/user/user.model";
import { decryptField } from "../../../utils/aws/kms";
import Wordpress from "./wordpress.model";
import type { IWordPress, TWordPressUpdate } from "./wordpress.types";

export default class WordPressService {
    private readonly PLATFORM = constants.user.platforms.WORDPRESS;

    private async wordpress(user_id: Types.ObjectId | undefined) {
        try {
            const platform = await this.getPlatform(user_id);

            if (!platform) {
                return;
            }

            const decryptedPassword = await decryptField(platform.password);

            const wp = await WPAPI.discover(platform.site_url);

            wp.auth({
                username: platform.username,
                password: decryptedPassword,
            });

            return wp;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async createPlatform(platform: IWordPress) {
        try {
            const newPlatform = await Wordpress.create(platform);

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

            return newPlatform as IWordPress;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the platform. Please try again later.",
            });
        }
    }

    async updatePlatform(platform: TWordPressUpdate, user_id: Types.ObjectId | undefined) {
        try {
            const updatedPlatform = await Wordpress.findOneAndUpdate(
                {
                    user_id,
                },
                platform,
                {
                    new: true,
                },
            );

            return updatedPlatform as IWordPress;
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

            return (await Wordpress.findOneAndDelete({ user_id }).exec()) as IWordPress;
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
            return (await Wordpress.findOne({ user_id }).exec()) as IWordPress;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    async getWordPressSite(site_url: string, username: string, password: string) {
        try {
            if (!password) {
                return;
            }

            const wp = await WPAPI.discover(site_url);

            wp.auth({
                username: username,
                password: password,
            });

            console.log({ wp });
            return wp;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while fetching the WordPress site. Make sure all the details are correct and try again.",
            });
        }
    }
}
