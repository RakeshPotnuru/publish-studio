import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import DevTo from "./devto.model";
import type {
    IDevTo,
    IDevToCreatePostInput,
    IDevToCreatePostOutput,
    IDevToUserOutput,
} from "./devto.types";

export default class DevToService {
    async getUserDetails(api_key: string) {
        const response = await axios.get(`${defaultConfig.devto_api_url}/users/me`, {
            headers: {
                "api-key": api_key,
            },
        });

        return response.data as unknown as IDevToUserOutput;
    }

    async createUser(user: IDevTo) {
        return (await DevTo.create(user)) as IDevTo;
    }

    async updateUser(user: IDevTo, user_id: string | undefined) {
        return (await DevTo.findByIdAndUpdate(user_id, user, {
            new: true,
        }).exec()) as IDevTo;
    }

    async deleteUser(user_id: string | undefined) {
        return (await DevTo.findByIdAndDelete(user_id).exec()) as IDevTo;
    }

    async getUserById(user_id: Types.ObjectId | undefined) {
        return (await DevTo.findOne({ user_id }).exec()) as IDevTo;
    }

    async publishPost(post: IDevToCreatePostInput, api_key: string) {
        const response = await axios.post(`${defaultConfig.devto_api_url}/articles`, post, {
            headers: {
                "Content-Type": "application/json",
                "api-key": api_key,
            },
        });

        return response as unknown as IDevToCreatePostOutput;
    }
}
