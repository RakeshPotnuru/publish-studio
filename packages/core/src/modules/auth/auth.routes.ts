import { z } from "zod";

import { protectedProcedure, t } from "../../trpc";
import { user } from "../../utils/constants";
import AuthController from "./auth.controller";

const authRouter = t.router({
    register: t.procedure
        .input(
            z.object({
                first_name: z
                    .string()
                    .min(user.firstName.MIN_LENGTH)
                    .max(user.firstName.MAX_LENGTH),
                last_name: z.string().min(user.lastName.MIN_LENGTH).max(user.lastName.MAX_LENGTH),
                email: z.string().email().toLowerCase(),
                password: z
                    .string()
                    .regex(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}~-])(.{8,})$/,
                    ),
                profile_pic: z.string().optional(),
                user_type: z.nativeEnum(user.userTypes).optional().default(user.userTypes.FREE),
            }),
        )
        .mutation(({ input }) => new AuthController().registerHandler(input)),

    login: t.procedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(user.password.MIN_LENGTH),
            }),
        )
        .mutation(({ input, ctx }) => new AuthController().loginHandler(input, ctx)),

    logout: protectedProcedure.mutation(({ ctx }) => new AuthController().logoutHandler(ctx)),

    refresh: protectedProcedure.query(({ ctx }) =>
        new AuthController().refreshAccessTokenHandler(ctx),
    ),
});

export default authRouter;
