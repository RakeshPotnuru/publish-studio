import { z } from "zod";

import { constants, UserType } from "../../config/constants";
import { protectedProcedure, router, t } from "../../trpc";
import UserController from "../user/user.controller";
import type { IUser } from "../user/user.types";
import AuthController from "./auth.controller";

const authRouter = router({
  register: t.procedure
    .input(
      z.object({
        first_name: z
          .string()
          .regex(
            /^((?!\p{Extended_Pictographic}).)*$/u,
            "Emojis are not allowed",
          )
          .min(constants.user.firstName.MIN_LENGTH)
          .max(constants.user.firstName.MAX_LENGTH),
        last_name: z
          .string()
          .regex(
            /^((?!\p{Extended_Pictographic}).)*$/u,
            "Emojis are not allowed",
          )
          .min(constants.user.lastName.MIN_LENGTH)
          .max(constants.user.lastName.MAX_LENGTH),
        email: z.string().email().toLowerCase(),
        password: z
          .string()
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}~-])(.{8,})$/,
          ),
        profile_pic: z.string().optional(),
        user_type: z.nativeEnum(UserType).optional().default(UserType.FREE),
      }),
    )
    .mutation(() => new AuthController().registerHandler()),

  connectGoogle: t.procedure
    .input(
      z.object({
        id_token: z.string(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new AuthController().connectGoogleHandler(input, ctx),
    ),

  login: t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/login",
      },
    })
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .output(
      z.object({
        status: z.string(),
        data: z.object({
          user: z.custom<Omit<IUser, "google_sub">>(),
        }),
      }),
    )
    .mutation(({ input, ctx }) =>
      new AuthController().loginHandler(input, ctx),
    ),

  logout: protectedProcedure.mutation(({ ctx }) =>
    new AuthController().logoutHandler(ctx),
  ),

  getMe: protectedProcedure.query(({ ctx }) => {
    return new UserController().getMeHandler(ctx);
  }),

  refresh: t.procedure.query(({ ctx }) =>
    new AuthController().refreshAccessTokenHandler(ctx),
  ),

  email: router({
    verify: t.procedure
      .input(
        z.object({
          token: z.string(),
        }),
      )
      .mutation(({ input, ctx }) =>
        new AuthController().verifyEmailHandler(input, ctx),
      ),

    resendVerification: t.procedure
      .input(
        z.object({
          email: z.string().email(),
        }),
      )
      .mutation(({ input }) =>
        new AuthController().resendVerificationEmailHandler(input),
      ),

    sendResetPassword: t.procedure
      .input(
        z.object({
          email: z.string().email(),
        }),
      )
      .mutation(({ input }) =>
        new AuthController().sendResetPasswordEmailHandler(input),
      ),
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

  verifyCaptcha: t.procedure
    .input(z.string())
    .mutation(({ input, ctx }) =>
      new AuthController().verifyCaptchaHandler(input, ctx),
    ),

  pusherAuth: protectedProcedure
    .input(
      z.object({
        socket_id: z.string(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new AuthController().pusherAuthHandler(input, ctx),
    ),
});

export default authRouter;
