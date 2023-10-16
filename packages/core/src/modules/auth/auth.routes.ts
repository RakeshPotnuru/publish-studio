import { z } from "zod";

import { constants } from "../../constants";
import { protectedProcedure, t } from "../../trpc";
import AuthController from "./auth.controller";

const authRouter = t.router({
    register: t.procedure
        .input(
            z.object({
                first_name: z
                    .string()
                    .min(constants.user.firstName.MIN_LENGTH)
                    .max(constants.user.firstName.MAX_LENGTH),
                last_name: z
                    .string()
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
                password: z.string().min(constants.user.password.MIN_LENGTH),
            }),
        )
        .mutation(({ input, ctx }) => new AuthController().loginHandler(input, ctx)),

    logout: protectedProcedure.mutation(({ ctx }) => new AuthController().logoutHandler(ctx)),

    refresh: protectedProcedure.query(({ ctx }) =>
        new AuthController().refreshAccessTokenHandler(ctx),
    ),

    verifyEmail: t.procedure
        .input(
            z.object({
                token: z.string(),
            }),
        )
        .mutation(({ input }) => new AuthController().verifyEmailHandler(input)),

    resendVerificationEmail: t.procedure
        .input(
            z.object({
                email: z.string().email(),
            }),
        )
        .mutation(({ input }) => new AuthController().resendVerificationEmailHandler(input)),

    sendResetPasswordEmail: t.procedure
        .input(
            z.object({
                email: z.string().email(),
            }),
        )
        .mutation(({ input }) => new AuthController().sendResetPasswordEmailHandler(input)),

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
