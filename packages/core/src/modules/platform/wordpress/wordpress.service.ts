import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../config/constants";
import Platform from "../../../modules/platform/platform.model";
import User from "../../../modules/user/user.model";
import { decryptField } from "../../../utils/aws/kms";
import WordPress from "./wordpress.model";
import type {
    IWordPress,
    IWordPressCreatePostInput,
    IWordPressCreatePostOutput,
    IWordPressSiteOutput,
    IWordPressUpdateInput,
    IWordPressUpdatePostInput,
    IWordPressUpdatePostOutput,
    TWordPressCreateInput,
} from "./wordpress.types";

export default class WordPressService {
    private readonly PLATFORM = constants.user.platforms.WORDPRESS;
    private readonly API_URL = defaultConfig.wordpress_api_url;
    private readonly API_VERSION = "v1.1";

    private async wordpress(user_id: Types.ObjectId) {
        try {
            const platform = await this.getPlatform(user_id);

            if (!platform) {
                return;
            }

            const decryptedToken = await decryptField(platform.token);

            return axios.create({
                baseURL: `${this.API_URL}/rest/${this.API_VERSION}/`,
                timeout: 10_000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${decryptedToken}`,
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

    async createPlatform(platform: TWordPressCreateInput): Promise<IWordPress> {
        try {
            const newPlatform = await WordPress.create(platform);

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
        platform: IWordPressUpdateInput,
        user_id: Types.ObjectId,
    ): Promise<IWordPress | null> {
        try {
            return await WordPress.findOneAndUpdate(
                {
                    user_id,
                },
                platform,
                {
                    new: true,
                },
            ).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the platform. Please try again later.",
            });
        }
    }

    async deletePlatform(user_id: Types.ObjectId): Promise<IWordPress | null> {
        try {
            // Note: There's no way I can disconnect this application from user's connected applications
            await Platform.findOneAndDelete({
                user_id,
                name: this.PLATFORM,
            }).exec();

            await User.findByIdAndUpdate(user_id, {
                $pull: {
                    platforms: this.PLATFORM,
                },
            }).exec();

            return await WordPress.findOneAndDelete({ user_id }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while disconnecting the platform. Please try again later.",
            });
        }
    }

    async getPlatform(user_id: Types.ObjectId): Promise<IWordPress | null> {
        try {
            return await WordPress.findOne({
                user_id,
            }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while getting the platform.",
            });
        }
    }

    async getPlatformByBlogId(blog_id: string) {
        try {
            return await WordPress.findOne({ blog_id }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while getting the platform.",
            });
        }
    }

    async getWordPressSite(code: string): Promise<IWordPressSiteOutput> {
        try {
            const response = await axios.post(
                `${this.API_URL}/oauth2/token`,
                {
                    client_id: process.env.WORDPRESS_CLIENT_ID,
                    redirect_uri: defaultConfig.wordpress_redirect_uri,
                    client_secret: process.env.WORDPRESS_CLIENT_SECRET,
                    code,
                    grant_type: "authorization_code",
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );

            return response.data as IWordPressSiteOutput;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid code.",
            });
        }
    }

    async publishPost(
        post: IWordPressCreatePostInput,
        user_id: Types.ObjectId,
    ): Promise<IWordPressCreatePostOutput> {
        try {
            const wordpress = await this.wordpress(user_id);

            const response = await wordpress?.post(`/sites/${post.blog_id}/posts/new`, post);

            return response?.data as IWordPressCreatePostOutput;
        } catch (error) {
            console.log(error);

            return { isError: true };
        }
    }

    async updatePost(
        post: IWordPressUpdatePostInput,
        user_id: Types.ObjectId,
    ): Promise<IWordPressUpdatePostOutput> {
        try {
            const wordpress = await this.wordpress(user_id);

            const response = await wordpress?.post(
                `/sites/${post.blog_id}/posts/${post.post_id}`,
                post,
            );

            return response?.data as IWordPressUpdatePostOutput;
        } catch (error) {
            console.log(error);

            return { isError: true };
        }
    }
}
