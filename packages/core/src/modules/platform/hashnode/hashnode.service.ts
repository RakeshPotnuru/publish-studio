import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { decryptField } from "../../../utils/aws/kms";
import { user as userConsts } from "../../../utils/constants";
import User from "../../user/user.model";
import Platform from "../platform.model";
import Hashnode from "./hashnode.model";
import type {
    IHashnode,
    IHashnodeCreatePostOutput,
    IHashnodeCreateStoryInput,
    IHashnodeUpdate,
    IHashnodeUserOutput,
} from "./hashnode.types";

export default class HashnodeService {
    private readonly PLATFORM = userConsts.platforms.HASHNODE;

    private async hashnode(user_id: Types.ObjectId | undefined) {
        try {
            const user = await this.getPlatformById(user_id);

            if (!user.api_key) {
                return;
            }

            const decryptedAPIKey = await decryptField(user.api_key);

            return axios.create({
                baseURL: defaultConfig.hashnode_api_url,
                timeout: 10_000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: decryptedAPIKey,
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

    async createPlatform(user: IHashnode) {
        try {
            const newPlatform = await Hashnode.create(user);

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

            return newPlatform as IHashnode;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the account. Please try again later.",
            });
        }
    }

    async updatePlatform(user: IHashnodeUpdate, user_id: Types.ObjectId | undefined) {
        try {
            return (await Hashnode.findOneAndUpdate({ user_id }, user, {
                new: true,
            }).exec()) as IHashnode;
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

            return (await Hashnode.findOneAndDelete({ user_id }).exec()) as IHashnode;
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
            return (await Hashnode.findOne({ user_id }).exec()) as IHashnode;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the account. Please try again later.",
            });
        }
    }

    async getHashnodeUser(username: string) {
        try {
            const response = await axios.post(
                defaultConfig.hashnode_api_url,
                {
                    query: `query user($username: String!) {
                user(username: $username) {
                    photo
                    blogHandle
                    publication {
                        _id
                        favicon
                    }
                }
            }`,
                    variables: {
                        username,
                    },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            return response.data.data.user as IHashnodeUserOutput;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async publishPost(post: IHashnodeCreateStoryInput, user_id: Types.ObjectId | undefined) {
        try {
            const hashnode = await this.hashnode(user_id);

            const response = await hashnode?.post("", {
                query: `mutation createStory($input: CreateStoryInput!) {
                    createStory(input: $input) {
                        code
                        success
                        message
                        post {
                            title
                            contentMarkdown
                            tags {
                                name
                            }
                            slug
                            coverImage
                            brief
                            blogHandle
                        }
                    }
                }`,
                variables: {
                    input: post,
                },
            });

            return response?.data as IHashnodeCreatePostOutput;
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while publishing the post to Hashnode.",
            });
        }
    }
}
