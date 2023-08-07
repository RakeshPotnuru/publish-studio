import { TRPCError } from "@trpc/server";
import type { AxiosInstance } from "axios";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { decryptField } from "../../../utils/aws/kms";
import DevTo from "./devto.model";
import type {
    IDevTo,
    IDevToCreatePostInput,
    IDevToCreatePostOutput,
    IDevToUserOutput,
} from "./devto.types";

export default class DevToService {
    private devTo!: AxiosInstance;
    private apiKey: string | null = null;

    constructor(user_id: Types.ObjectId | undefined) {
        this.initialize(user_id).catch(error => {
            console.error("Error initializing DevToService:", error);

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

        this.devTo = axios.create({
            baseURL: defaultConfig.devto_api_url,
            timeout: 10_000,
            headers: {
                "Content-Type": "application/json",
                "api-key": this.apiKey,
            },
        });
    }

    async createUser(user: IDevTo) {
        return (await DevTo.create(user)) as IDevTo;
    }

    async updateUser(user: IDevTo, user_id: Types.ObjectId | undefined) {
        return (await DevTo.findOneAndUpdate({ user_id }, user, {
            new: true,
        }).exec()) as IDevTo;
    }

    async deleteUser(user_id: Types.ObjectId | undefined) {
        return (await DevTo.findOneAndDelete({ user_id }).exec()) as IDevTo;
    }

    async getUserById(user_id: Types.ObjectId | undefined) {
        return (await DevTo.findOne({ user_id }).exec()) as IDevTo;
    }

    /* This method is used exactly once before creating user in `DevController().createUserHandler(...)` method
    to fetch user Dev.to details and store them in database. That's why api key is used directly. */
    async getDevUser(api_key: string) {
        const response = await axios.get(`${defaultConfig.devto_api_url}/users/me`, {
            headers: {
                "api-key": api_key,
            },
        });

        return response.data as IDevToUserOutput;
    }

    async publishPost(post: IDevToCreatePostInput) {
        const response = await this.devTo.post("/articles", post);

        return response.data as IDevToCreatePostOutput;
    }
}
