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
    IHashnodeCreateStoryInput,
    IHashnodeUpdatePostOutput,
    IHashnodeUserOutput,
    THashnodeCreatePostOutput,
} from "./hashnode.types";

export default class HashnodeService {
    private readonly PLATFORM = constants.user.platforms.HASHNODE;

    private async hashnode(user_id: Types.ObjectId) {
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

    async updatePlatform(user: Partial<IHashnode>, user_id: Types.ObjectId) {
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

    async deletePlatform(user_id: Types.ObjectId) {
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

    async getPlatform(user_id: Types.ObjectId) {
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

    async getPlatformByUsername(username: string) {
        try {
            return await Hashnode.findOne({ username }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    /* This method is used exactly twice before creating or updating user in `HashnodeController()` class
    to fetch user Hashnode details and update them in database. That's why api key is being used directly. */
    async getHashnodeUser(api_key: string) {
        try {
            const response = await axios.post(
                defaultConfig.hashnode_api_url,
                {
                    query: `query Me {
                                me {
                                    id
                                    username
                                    profilePicture
                                    publications(first: 1, filter: { roles: [OWNER] }) {
                                        edges {
                                            node {
                                                id
                                                url
                                                favicon
                                            }
                                        }
                                    }
                                }
                            }`,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: api_key,
                    },
                },
            );

            return response.data as IHashnodeUserOutput;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async publishPost(
        post: IHashnodeCreateStoryInput,
        user_id: Types.ObjectId,
    ): Promise<THashnodeCreatePostOutput> {
        try {
            const hashnode = await this.hashnode(user_id);

            const response = await hashnode?.post("", {
                query: `mutation PublishPost($input: PublishPostInput!) {
                            publishPost(input: $input) {
                                post {
                                    id
                                    slug
                                }
                            } 
                        }`,
                variables: {
                    input: post,
                },
            });

            return response?.data as THashnodeCreatePostOutput;
        } catch (error) {
            console.log(error);

            return { isError: true };
        }
    }

    async updatePost(
        post: Partial<IHashnodeCreateStoryInput>,
        post_id: string,
        user_id: Types.ObjectId,
    ): Promise<IHashnodeUpdatePostOutput> {
        try {
            const hashnode = await this.hashnode(user_id);

            const response = await hashnode?.post("", {
                query: `mutation UpdatePost($input: UpdatePostInput!) {
                            updatePost(input: $input) {
                                post {
                                    id
                                    slug
                                }
                            }
                        }`,
                variables: {
                    input: {
                        id: post_id,
                        ...post,
                    },
                },
            });

            return response?.data as IHashnodeUpdatePostOutput;
        } catch (error) {
            console.log(error);

            return { isError: true };
        }
    }
}
