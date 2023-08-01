import { TRPCError } from "@trpc/server";

import defaultConfig from "../../config/app.config";
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
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
