import customConfig from "../config/default";
import User from "../models/user.model";
import type { IUser } from "../types/user.types";
import { signJwt } from "../utils/jwt";
import redisClient from "../utils/redis";

export default class UserService {
    async createUser(user: IUser) {
        return (await User.create(user)) as IUser;
    }

    async getUserByEmail(email: string) {
        return (await User.findOne({ email }).exec()) as IUser;
    }

    async getUserById(id: string) {
        return (await User.findById(id).exec()) as IUser;
    }

    async updateUser(id: string, user: IUser) {
        return (await User.findByIdAndUpdate(id, user, { new: true }).exec()) as IUser;
    }

    async signTokens(user: IUser) {
        if (!user._id) {
            throw new Error("User ID is required");
        }

        const userId = user._id.toString();

        await redisClient.set(userId, JSON.stringify(user), {
            EX: customConfig.redisCacheExpiresIn * 60,
        });

        const access_token = signJwt({ sub: user._id }, "accessTokenPrivateKey", {
            expiresIn: `${customConfig.accessTokenExpiresIn}m`,
        });

        const refresh_token = signJwt({ sub: user._id }, "refreshTokenPrivateKey", {
            expiresIn: `${customConfig.refreshTokenExpiresIn}m`,
        });

        return { access_token, refresh_token };
    }
}
