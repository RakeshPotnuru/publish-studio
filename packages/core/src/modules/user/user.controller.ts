import { TRPCError } from "@trpc/server";

import defaultConfig from "../../config/app.config";
import type { Context } from "../../trpc";
import UserService from "./user.service";

export default class UserController extends UserService {
    getMeHandler(ctx: Context) {
        try {
            const user = ctx.user;

            return {
                status: "success",
                data: {
                    user,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async getUserHandler(ctx: Context) {
        const user = await this.getUserById(ctx.user?._id);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }

        return {
            status: "success",
            data: {
                user: user,
            },
        };
    }
}
