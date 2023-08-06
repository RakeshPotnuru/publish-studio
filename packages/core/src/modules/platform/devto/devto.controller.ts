import { TRPCError } from "@trpc/server";

import type { Context } from "../../../trpc";
import DevToService from "./devto.service";

export default class DevToController extends DevToService {
    async createUserHandler(input: { api_key: string }, ctx: Context) {
        try {
            const user = await super.getUserDetails(input.api_key);

            if (user.error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: user.error,
                });
            }

            const newUser = await super.createUser({
                user_id: ctx.user?._id,
                api_key: input.api_key,
                username: user.data.username,
                profile_pic: user.data.profile_image,
            });

            return {
                status: "success",
                data: {
                    user: newUser,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the user.",
            });
        }
    }
}
