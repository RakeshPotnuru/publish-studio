import { TRPCError } from "@trpc/server";
import type { AxiosInstance } from "axios";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { decryptField } from "../../../utils/aws/kms";
import Hashnode from "./hashnode.model";
import type {
    IHashnode,
    IHashnodeCreatePostOutput,
    IHashnodeCreateStoryInput,
    IHashnodeUserOutput,
} from "./hashnode.types";

export default class HashnodeService {
    private hashnode!: AxiosInstance;
    private apiKey: string | null = null;

    constructor(user_id: Types.ObjectId | undefined) {
        this.initialize(user_id).catch(error => {
            console.error("Error initializing HashnodeService:", error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        });
    }

    private async initialize(user_id: Types.ObjectId | undefined) {
        const user = await this.getUserById(user_id);

        if (!user.api_key) {
            return;
        }

        this.apiKey = await decryptField(user.api_key);

        this.hashnode = axios.create({
            baseURL: defaultConfig.hashnode_api_url,
            timeout: 10_000,
            headers: {
                "Content-Type": "application/json",
                Authorization: this.apiKey,
            },
        });
    }

    async createUser(user: IHashnode) {
        return (await Hashnode.create(user)) as IHashnode;
    }

    async updateUser(user: IHashnode, user_id: Types.ObjectId | undefined) {
        return (await Hashnode.findOneAndUpdate({ user_id }, user, {
            new: true,
        }).exec()) as IHashnode;
    }

    async deleteUser(user_id: Types.ObjectId | undefined) {
        return (await Hashnode.findOneAndDelete({ user_id }).exec()) as IHashnode;
    }

    async getUserById(user_id: Types.ObjectId | undefined) {
        return (await Hashnode.findOne({ user_id }).exec()) as IHashnode;
    }

    async getHashnodeUser(username: string) {
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
    }

    async publishPost(post: IHashnodeCreateStoryInput) {
        const response = await this.hashnode.post("", {
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

        return response.data.data.createStory as IHashnodeCreatePostOutput;
    }
}
