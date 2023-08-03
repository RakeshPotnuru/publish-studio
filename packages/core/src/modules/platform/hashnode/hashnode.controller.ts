import { TRPCError } from "@trpc/server";

import defaultConfig from "../../../config/app.config";
import type { Context } from "../../../trpc";
import HashnodeService from "./hashnode.service";

export default class HashnodeController extends HashnodeService {
    async createUserHandler(input: { username: string; api_key: string }, ctx: Context) {
        try {
            const { username, api_key } = input;

            const user = await this.getUserDetails(username);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found. Correct your username and try again.",
                });
            }

            const newHashnodeUser = await this.createUser({
                api_key,
                user_id: ctx.user?._id,
                username,
                profile_pic: user.photo,
                blog_handle: user.blogHandle,
                publication: {
                    publication_id: user.publication._id,
                    publication_logo: user.publication.favicon,
                },
            });

            return {
                status: "success",
                data: {
                    user: newHashnodeUser,
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

    async getUserHandler(input: { username: string }) {
        try {
            const user = await this.getUserDetails(input.username);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found. Correct your username and try again.",
                });
            }

            return {
                status: "success",
                data: {
                    user: user,
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
}
