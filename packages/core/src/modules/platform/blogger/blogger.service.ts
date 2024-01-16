import blogger from "@googleapis/blogger";
import { TRPCError } from "@trpc/server";
import { OAuth2Client } from "google-auth-library";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../config/constants";
import Platform from "../../../modules/platform/platform.model";
import User from "../../../modules/user/user.model";
import { decryptField } from "../../../utils/aws/kms";
import Blogger from "./blogger.model";
import type {
    IBlogger,
    IBloggerCreatePostInput,
    IBloggerUpdatePostOutput,
    IBloggerUserUpdate,
    TBloggerUpdatePostInput,
} from "./blogger.types";

export default class BloggerService {
    private readonly PLATFORM = constants.user.platforms.BLOGGER;
    private readonly BLOGGER_VERSION = "v3";
    private oauth2Client = new OAuth2Client(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        defaultConfig.blogger_redirect_uri,
    );

    getAuthUrl() {
        try {
            return this.oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: ["https://www.googleapis.com/auth/blogger"],
                prompt: "consent",
            });
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    private async blogger(user_id: Types.ObjectId) {
        try {
            const platform = await this.getPlatform(user_id);

            if (!platform) {
                return;
            }

            const decryptedToken = await decryptField(platform.token);

            this.oauth2Client.setCredentials({
                refresh_token: decryptedToken,
            });

            return blogger.blogger({
                version: this.BLOGGER_VERSION,
                auth: this.oauth2Client,
            });
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async createPlatform(platform: IBlogger) {
        try {
            const newPlatform = await Blogger.create(platform);

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

            return newPlatform as IBlogger;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the platform. Please try again later.",
            });
        }
    }

    async updatePlatform(platform: IBloggerUserUpdate, user_id: Types.ObjectId) {
        try {
            return (await Blogger.findOneAndUpdate(
                {
                    user_id,
                },
                platform,
                {
                    new: true,
                },
            ).exec()) as IBlogger;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the platform. Please try again later.",
            });
        }
    }

    async deletePlatform(user_id: Types.ObjectId, token: string) {
        try {
            const decryptedToken = await decryptField(token);

            await this.oauth2Client.revokeToken(decryptedToken);

            await User.findByIdAndUpdate(user_id, {
                $pull: {
                    platforms: this.PLATFORM,
                },
            }).exec();

            await Platform.findOneAndDelete({
                user_id,
                name: this.PLATFORM,
            }).exec();

            return (await Blogger.findOneAndDelete({
                user_id,
            }).exec()) as IBlogger;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while disconnecting the platform. Please try again later.",
            });
        }
    }

    async getPlatform(user_id: Types.ObjectId): Promise<IBlogger | null> {
        try {
            return await Blogger.findOne({
                user_id,
            }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    async getPlatformByBlogId(blog_id: string): Promise<IBlogger | null> {
        try {
            return await Blogger.findOne({
                blog_id,
            }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    async getBloggerBlogs(user_id: Types.ObjectId) {
        const blogs = await (
            await this.blogger(user_id)
        )?.blogs.listByUser({
            userId: "self",
        });

        if (!blogs?.data.items || blogs?.data.items.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "No blogs found for the user.",
            });
        }

        try {
            return blogs.data.items.map(blog => ({
                id: blog.id,
                url: blog.url,
            })) as {
                id: string;
                url: string;
            }[];
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the blogs. Please try again later.",
            });
        }
    }

    async getTokenAndBlogs(code: string) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);

            this.oauth2Client.setCredentials(tokens);

            const bloggerClient = blogger.blogger({
                version: this.BLOGGER_VERSION,
                auth: this.oauth2Client,
            });

            const blogs = await bloggerClient.blogs.listByUser({
                userId: "self",
            });

            if (!blogs.data.items || blogs.data.items.length === 0 || !tokens.refresh_token) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No blogs found for the user.",
                });
            }

            return {
                token: tokens.refresh_token,
                blogs: blogs.data.items.map(blog => ({
                    id: blog.id,
                    url: blog.url,
                })),
            } as {
                token: string;
                blogs: {
                    id: string;
                    url: string;
                }[];
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async publishPost(post: IBloggerCreatePostInput, user_id: Types.ObjectId) {
        const blogger = await this.blogger(user_id);

        return await blogger?.posts.insert(post);
    }

    async updatePost(
        post: TBloggerUpdatePostInput,
        post_id: string,
        user_id: Types.ObjectId,
    ): Promise<IBloggerUpdatePostOutput> {
        const blogger = await this.blogger(user_id);

        const response = await blogger?.posts.update({
            postId: post_id,
            ...post,
        });

        if (response?.statusText !== "OK") {
            return {
                isError: true,
            };
        }

        return {
            isError: false,
        };
    }
}
