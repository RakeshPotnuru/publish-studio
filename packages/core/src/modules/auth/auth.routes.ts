import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import defaultConfig from "../../config/app.config";
import { constants } from "../../config/constants";
import { protectedProcedure, router, t } from "../../trpc";
import { rateLimiterMiddleware } from "../../utils/rate-limiter";
import UserController from "../user/user.controller";
import AuthController from "./auth.controller";

const authRouter = router({
    register: t.procedure
        .input(
            z.object({
                first_name: z
                    .string()
                    .regex(/^((?!\p{Extended_Pictographic}).)*$/u, "Emojis are not allowed")
                    .min(constants.user.firstName.MIN_LENGTH)
                    .max(constants.user.firstName.MAX_LENGTH),
                last_name: z
                    .string()
                    .regex(/^((?!\p{Extended_Pictographic}).)*$/u, "Emojis are not allowed")
                    .min(constants.user.lastName.MIN_LENGTH)
                    .max(constants.user.lastName.MAX_LENGTH),
                email: z.string().email().toLowerCase(),
                password: z
                    .string()
                    .regex(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}~-])(.{8,})$/,
                    ),
                profile_pic: z.string().optional(),
                user_type: z
                    .nativeEnum(constants.user.userTypes)
                    .optional()
                    .default(constants.user.userTypes.FREE),
            }),
        )
        .mutation(({ input }) => new AuthController().registerHandler(input)),

    connectGoogle: t.procedure
        .input(
            z.object({
                id_token: z.string(),
            }),
        )
        .mutation(({ input, ctx }) => new AuthController().connectGoogleHandler(input, ctx)),

    login: t.procedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(1),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            if (!ctx.req.ip) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: defaultConfig.defaultErrorMessage,
                });
            }

            rateLimiterMiddleware({ default: Ratelimit.slidingWindow(2, "1 m") }, ctx.req.ip); // TODO: add path

            return new AuthController().loginHandler(input, ctx);
        }),

    logout: protectedProcedure.mutation(({ ctx }) => new AuthController().logoutHandler(ctx)),

    getMe: protectedProcedure.query(({ ctx }) => {
        rateLimiterMiddleware(
            {
                default: Ratelimit.slidingWindow(2, "1 m"),
                free: Ratelimit.slidingWindow(10, "1 m"),
                pro: Ratelimit.slidingWindow(20, "1 m"),
            },
            ctx.user._id.toString(), // TODO: add path
            ctx.user.user_type,
        );

        return new UserController().getMeHandler(ctx);
    }),

    refresh: protectedProcedure.query(({ ctx }) =>
        new AuthController().refreshAccessTokenHandler(ctx),
    ),

    email: router({
        verify: t.procedure
            .input(
                z.object({
                    token: z.string(),
                }),
            )
            .mutation(({ input }) => new AuthController().verifyEmailHandler(input)),

        resendVerification: t.procedure
            .input(
                z.object({
                    email: z.string().email(),
                }),
            )
            .mutation(({ input }) => new AuthController().resendVerificationEmailHandler(input)),

        sendResetPassword: t.procedure
            .input(
                z.object({
                    email: z.string().email(),
                }),
            )
            .mutation(({ input }) => new AuthController().sendResetPasswordEmailHandler(input)),
    }),

    resetPassword: t.procedure
        .input(
            z.object({
                token: z.string(),
                password: z
                    .string()
                    .regex(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}~-])(.{8,})$/,
                    ),
            }),
        )
        .mutation(({ input }) => new AuthController().resetPasswordHandler(input)),
});

export default authRouter;
