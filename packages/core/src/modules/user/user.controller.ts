import { TRPCError } from "@trpc/server";

import type { Context } from "../../trpc";

export default class UserController {
    getMeHandler(ctx: Context) {
        try {
            const user = ctx.user;

            return {
                status: "success",
                data: {
                    user,
                },
            };
        } catch (error: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
            });
        }
    }
}
