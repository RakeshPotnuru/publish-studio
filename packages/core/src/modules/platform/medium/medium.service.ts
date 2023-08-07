import { TRPCError } from "@trpc/server";
import type { AxiosInstance } from "axios";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { decryptField } from "../../../utils/aws/kms";
import Medium from "./medium.model";
import type { IMedium, IMediumCreatePostInput, IMediumUser } from "./medium.types";

export default class MediumService {
    private medium!: AxiosInstance;
    private apiKey: string | null = null;

    constructor(user_id: Types.ObjectId | undefined) {
        this.initialize(user_id).catch(error => {
            console.error("Error initializing MediumService:", error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        });
    }

    private async initialize(user_id: Types.ObjectId | undefined) {
        const user = await this.getUserById(user_id);

        if (!user) {
            return;
        }

        this.apiKey = await decryptField(user.api_key);

        this.medium = axios.create({
            baseURL: defaultConfig.medium_api_url,
            timeout: 10_000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
        });
    }

    async createUser(user: IMedium) {
        return (await Medium.create(user)) as IMedium;
    }

    async updateUser(user: IMedium, user_id: Types.ObjectId | undefined) {
        return (await Medium.findOneAndUpdate({ user_id }, user, {
            new: true,
        }).exec()) as IMedium;
    }

    async deleteUser(user_id: Types.ObjectId | undefined) {
        return (await Medium.findOneAndDelete({ user_id }).exec()) as IMedium;
    }

    async getUserById(user_id: Types.ObjectId | undefined) {
        return (await Medium.findOne({ user_id }).exec()) as IMedium;
    }

    /* This method is used exactly once before creating user in `MediumController().createUserHandler(...)` method
    to fetch user Medium details and store them in database. That's why api key is used directly. */
    async getMediumUser(api_key: string) {
        const response = await axios.get(`${defaultConfig.medium_api_url}/me`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${api_key}`,
            },
        });

        return response.data as IMediumUser;
    }

    async publishPost(post: IMediumCreatePostInput, author_id: string) {
        const response = await this.medium.post("/users/" + author_id + "/posts", post);

        return response.data as IMediumCreatePostInput;
    }
}
