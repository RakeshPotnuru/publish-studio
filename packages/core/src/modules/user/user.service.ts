import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app.config";
import { signJwt } from "../../utils/jwt";
import redisClient from "../../utils/redis";
import User from "./user.model";
import type { IRegisterInput, IUser, IUserUpdate } from "./user.types";

export default class UserService {
    async createUser(user: IRegisterInput) {
        try {
            return (await User.create(user)) as IUser;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the user. Please try again later.",
            });
        }
    }

    async getUserByEmail(email: string) {
        try {
            return (await User.findOne({ email }).exec()) as IUser;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the user. Please try again later.",
            });
        }
    }

    async getUserById(id: Types.ObjectId | undefined) {
        try {
            return (await User.findById(id).populate("platforms").exec()) as IUser;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the user. Please try again later.",
            });
        }
    }

    async updateUser(id: Types.ObjectId, user: IUserUpdate) {
        try {
            return (await User.findByIdAndUpdate(id, user, { new: true }).exec()) as IUser;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the user. Please try again later.",
            });
        }
    }

    async signTokens(user: IUser) {
        try {
            const userId = user._id.toString();

            await redisClient.set(userId, JSON.stringify(user), {
                EX: defaultConfig.redisCacheExpiresIn * 60,
            });

            const access_token = signJwt({ sub: user._id }, "accessTokenPrivateKey", {
                expiresIn: `${defaultConfig.accessTokenExpiresIn}m`,
            });

            const refresh_token = signJwt({ sub: user._id }, "refreshTokenPrivateKey", {
                expiresIn: `${defaultConfig.refreshTokenExpiresIn}m`,
            });

            return { access_token, refresh_token };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
