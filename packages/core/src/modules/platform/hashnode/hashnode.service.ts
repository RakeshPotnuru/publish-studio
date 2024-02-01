import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { Platform } from "../../../config/constants";
import PlatformModel from "../../platform/platform.model";
import User from "../../user/user.model";
import Hashnode from "./hashnode.model";
import type {
    IHashnode,
    IHashnodeCreatePostInput,
    IHashnodeGetAllPostsOutput,
    IHashnodeUpdatePostOutput,
    IHashnodeUserOutput,
    THashnodeCreateInput,
    THashnodeCreatePostOutput,
    THashnodeToUpdatePost,
    THashnodeUpdateInput,
} from "./hashnode.types";

export default class HashnodeService {
    private readonly PLATFORM = Platform.HASHNODE;

    private async hashnode(user_id: Types.ObjectId) {
        const platform = await Hashnode.findOne({ user_id }).exec();

        if (!platform) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Platform not found",
            });
        }

        try {
            return axios.create({
                baseURL: defaultConfig.hashnode_api_url,
                timeout: 10_000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: platform.api_key,
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

    async createPlatform(user: THashnodeCreateInput): Promise<boolean> {
        try {
            const newPlatform = await Hashnode.create(user);

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
        platform: THashnodeUpdateInput,
        user_id: Types.ObjectId,
    ): Promise<boolean> {
        try {
            const doc = await Hashnode.findOne({ user_id }).exec();
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

            await Hashnode.findOneAndDelete({ user_id }).exec();

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

    async getPlatform(user_id: Types.ObjectId): Promise<Omit<IHashnode, "api_key"> | null> {
        try {
            return await Hashnode.findOne({ user_id }).select("-api_key").exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platform. Please try again later.",
            });
        }
    }

    async getPlatformByUsername(username: string): Promise<Omit<IHashnode, "api_key"> | null> {
        try {
            return await Hashnode.findOne({ username }).select("-api_key").exec();
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
    async getHashnodeUser(api_key: string): Promise<IHashnodeUserOutput> {
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
        post: IHashnodeCreatePostInput,
        user_id: Types.ObjectId,
    ): Promise<THashnodeCreatePostOutput> {
        try {
            const hashnode = await this.hashnode(user_id);

            const response = await hashnode.post("", {
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

            return response.data as THashnodeCreatePostOutput;
        } catch (error) {
            console.log(error);

            return { isError: true };
        }
    }

    async updatePost(
        post: THashnodeToUpdatePost,
        user_id: Types.ObjectId,
    ): Promise<IHashnodeUpdatePostOutput> {
        try {
            const hashnode = await this.hashnode(user_id);

            const response = await hashnode.post("", {
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
                        id: post.post_id,
                        ...post,
                    },
                },
            });

            return response.data as IHashnodeUpdatePostOutput;
        } catch (error) {
            console.log(error);

            return { isError: true };
        }
    }

    async getAllPosts(
        pagination: {
            limit: number;
            end_cursor?: string;
        },
        user_id: Types.ObjectId,
    ): Promise<IHashnodeGetAllPostsOutput> {
        try {
            const platform = await this.getPlatform(user_id);

            if (!platform) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Account not found. Please connect your Hashnode account to continue.",
                });
            }

            const hashnode = await this.hashnode(user_id);

            const response = await hashnode.post("", {
                query: `query Publication($id: ObjectId, $limit: Int!, $after: String) {
                            publication(id: $id) {
                                posts(first: $limit, after: $after) {
                                    edges {
                                        node {
                                            id
                                            title
                                            url
                                            canonicalUrl
                                            coverImage {
                                                url
                                            }
                                            brief
                                            content {
                                                markdown
                                            }
                                            publishedAt
                                            seo {
                                                title
                                                description
                                            }

                                        }
                                    }
                                    pageInfo {
                                        endCursor
                                        hasNextPage
                                    }
                                    totalDocuments
                                }
                            }
                        }`,
                variables: {
                    id: platform.publication.publication_id,
                    limit: pagination.limit,
                    after: pagination.end_cursor,
                },
            });

            return response.data as IHashnodeGetAllPostsOutput;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching posts. Please try again later.",
            });
        }
    }
}
