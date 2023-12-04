import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { constants } from "../../../config/constants";
import { decryptField } from "../../../utils/aws/kms";
import Platform from "../../platform/platform.model";
import User from "../../user/user.model";
import Hashnode from "./hashnode.model";
import type {
    IHashnode,
    IHashnodeCreatePostOutput,
    IHashnodeCreateStoryInput,
    IHashnodeUpdate,
    IHashnodeUserOutput,
} from "./hashnode.types";

export default class HashnodeService {
    private readonly PLATFORM = constants.user.platforms.HASHNODE;

    private async hashnode(user_id: Types.ObjectId | undefined) {
        try {
            const platform = await this.getPlatform(user_id);

            if (!platform.api_key) {
                return;
            }

            const decryptedAPIKey = await decryptField(platform.api_key);

            return axios.create({
                baseURL: defaultConfig.hashnode_api_url,
                timeout: 10_000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: decryptedAPIKey,
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
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while connecting the platform. Please try again later.",
            });
        }
    }

    async updatePlatform(user: IHashnodeUpdate, user_id: Types.ObjectId | undefined) {
        try {
            return (await Hashnode.findOneAndUpdate({ user_id }, user, {
                new: true,
            }).exec()) as IHashnode;
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

            return (await Hashnode.findOneAndDelete({ user_id }).exec()) as IHashnode;
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
            return (await Hashnode.findOne({ user_id }).exec()) as IHashnode;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
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
            console.log(error);

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
                        }
                    }
                }`,
                variables: {
                    input: post,
                },
            });

            return response?.data as IHashnodeCreatePostOutput;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while publishing the post to Hashnode.",
            });
        }
    }

    async updatePost(
        post: IHashnodeCreateStoryInput,
        post_id: string,
        user_id: Types.ObjectId | undefined,
    ) {
        try {
            const hashnode = await this.hashnode(user_id);

            const response = await hashnode?.post("", {
                query: `mutation updateStory($postId: String!, $input: UpdateStoryInput!) {
                    updateStory(postId: $postId, input: $input) {
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
                        }
                    }
                }`,
                variables: {
                    postId: post_id,
                    input: post,
                },
            });

            return response?.data as IHashnodeCreatePostOutput;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the post on Hashnode.",
            });
        }
    }
}
