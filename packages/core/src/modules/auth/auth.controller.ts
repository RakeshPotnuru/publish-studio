import { TRPCError } from "@trpc/server";
import axios from "axios";
import bcrypt from "bcryptjs";
import type { SetOption } from "cookies";
import Cookies from "cookies";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app";
import { AuthMode, ErrorCause, UserType } from "../../config/constants";
import type { Context } from "../../trpc";
import { verifyGoogleToken } from "../../utils/google/auth";
import { signJwt, verifyJwt } from "../../utils/jwt";
import { logtail } from "../../utils/logtail";
import { pusher } from "../../utils/pusher";
import redisClient from "../../utils/redis";
import type {
  ILoginInput,
  IRegisterInput,
  IResetPasswordInput,
} from "../auth/auth.types";
import PlannerController from "../planner/planner.controller";
import AuthService from "./auth.service";

const cookieOptions: SetOption = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

const accessTokenCookieOptions: SetOption = {
  ...cookieOptions,
  expires: new Date(
    Date.now() + defaultConfig.accessTokenExpiresIn * 60 * 1000,
  ), // milliseconds
};

const refreshTokenCookieOptions: SetOption = {
  ...cookieOptions,
  expires: new Date(
    Date.now() + defaultConfig.refreshTokenExpiresIn * 60 * 1000,
  ),
};

export default class AuthController extends AuthService {
  async resendVerificationEmailHandler(input: { email: string }) {
    const user = await super.getUserByEmail(input.email);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    if (user.is_verified) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User is already verified",
      });
    }

    const token = await signJwt(
      { email: user.email },
      "verificationTokenPrivateKey",
      {
        expiresIn: `${defaultConfig.verificationTokenExpiresIn}m`,
      },
    );

    if (!token) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }

    return await this.sendVerificationEmail(user.email, token);
  }

  async verifyEmailHandler(input: { token: string }, ctx: Context) {
    const payload = await verifyJwt<{ email: string }>(
      input.token,
      "verificationTokenPublicKey",
    );

    if (!payload) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid token",
      });
    }

    const user = await super.getUserByEmail(payload.email);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    if (user.is_verified) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User is already verified",
      });
    }

    await super.updateUser(user._id, {
      is_verified: true,
    });

    await new PlannerController().initPlanner(user._id);

    await super.sendWelcomeEmail(user, {
      ...ctx,
      user: { ...ctx.user, _id: user._id },
    });

    return {
      status: "success",
      data: {
        message: "User verified successfully",
      },
    };
  }

  async registerHandler(input: IRegisterInput) {
    if (!input.password) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Password is required",
      });
    }

    if (await super.isDisposableEmail(input.email)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Disposable email is not allowed",
      });
    }

    const user = await super.getUserByEmail(input.email);

    if (user) {
      throw new TRPCError({
        code: "CONFLICT",
        message:
          "This email is associated with an existing account. Please login instead.",
      });
    }

    const verification_token = await signJwt(
      { email: input.email },
      "verificationTokenPrivateKey",
      {
        expiresIn: `${defaultConfig.verificationTokenExpiresIn}m`,
      },
    );

    if (!verification_token) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }

    await super.sendVerificationEmail(input.email, verification_token);

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(input.password, salt);
    const newUser = await super.createUser({
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      password: hashedPassword,
      profile_pic: input.profile_pic,
      user_type: input.user_type,
    });

    return {
      status: "success",
      data: {
        user: newUser,
      },
    };
  }

  async connectGoogleHandler(input: { id_token: string }, ctx: Context) {
    const payload = await verifyGoogleToken(input.id_token);

    const user = await super.getUserByEmail(payload.email);

    // If user does not exist, create a new user and login the user.
    if (!user) {
      const newUser = await super.createUser({
        first_name: payload.given_name,
        last_name: payload.family_name,
        email: payload.email,
        profile_pic: payload.picture,
        user_type: UserType.FREE,
        auth_modes: [AuthMode.GOOGLE],
        google_sub: payload.sub,
        is_verified: true,
      });

      const tokens = await super.signTokens(newUser);

      const access_token = await tokens.access_token;
      const refresh_token = await tokens.refresh_token;

      const { req, res } = ctx;
      const cookies = new Cookies(req, res, {
        secure: process.env.NODE_ENV === "production",
      });
      cookies.set("access_token", access_token, accessTokenCookieOptions);
      cookies.set("refresh_token", refresh_token, refreshTokenCookieOptions);
      cookies.set("logged_in", "true", accessTokenCookieOptions);

      await super.sendWelcomeEmail(newUser, {
        ...ctx,
        user: { ...ctx.user, _id: newUser._id },
      });

      return {
        status: "success",
        data: {
          access_token,
          refresh_token,
          user: newUser,
        },
      };
    }

    // If user exists, just login the user. If user does not have google auth mode, add it.
    if (!user.auth_modes.includes(AuthMode.GOOGLE)) {
      await super.updateUser(user._id, {
        auth_modes: [...user.auth_modes, AuthMode.GOOGLE],
        google_sub: payload.sub,
      });

      if (!user.profile_pic && payload.picture) {
        await super.updateUser(user._id, { profile_pic: payload.picture });
      }
    }

    const tokens = await super.signTokens(user);

    const access_token = await tokens.access_token;
    const refresh_token = await tokens.refresh_token;

    const { req, res } = ctx;
    const cookies = new Cookies(req, res, {
      secure: process.env.NODE_ENV === "production",
    });
    cookies.set("access_token", access_token, accessTokenCookieOptions);
    cookies.set("refresh_token", refresh_token, refreshTokenCookieOptions);
    cookies.set("logged_in", "true", accessTokenCookieOptions);

    return {
      status: "success",
      data: {
        access_token,
        refresh_token,
        user,
      },
    };
  }

  async loginHandler(input: ILoginInput, ctx: Context) {
    const user = await super.getUserByEmail(input.email);

    if (user && !user.password) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "This email is associated with a google account. Please login with Google.",
      });
    }

    if (
      !user ||
      (user.password && !(await bcrypt.compare(input.password, user.password)))
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    if (!user.is_verified) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: ErrorCause.VERIFICATION_PENDING,
      });
    }

    const tokens = await super.signTokens(user);

    const access_token = await tokens.access_token;
    const refresh_token = await tokens.refresh_token;

    const { req, res } = ctx;
    const cookies = new Cookies(req, res, {
      secure: process.env.NODE_ENV === "production",
    });
    cookies.set("access_token", access_token, { ...accessTokenCookieOptions });
    cookies.set("refresh_token", refresh_token, {
      ...refreshTokenCookieOptions,
    });
    cookies.set("logged_in", "true", { ...accessTokenCookieOptions });

    await super.updateUser(user._id, { last_login: new Date() });

    return {
      status: "success",
      data: {
        access_token,
        refresh_token,
        user,
      },
    };
  }

  async adminLoginHandler(input: ILoginInput, ctx: Context) {
    const isAdmin = await super.isAdmin(input.email);

    if (!isAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be an admin to access this resource",
      });
    }

    return await this.loginHandler(input, ctx);
  }

  async sendResetPasswordEmailHandler(input: { email: string }) {
    const user = await super.getUserByEmail(input.email);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "This email is not associated with any account. Please register instead.",
      });
    }

    if (!user.is_verified) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Please verify your email first. Check your inbox for the verification email.",
      });
    }

    const resetEmailToken = await signJwt(
      { email: input.email },
      "resetPasswordTokenPrivateKey",
      {
        expiresIn: `${defaultConfig.resetPasswordTokenExpiresIn}m`,
      },
    );

    if (!resetEmailToken) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }

    await this.sendResetPasswordEmail(input.email, resetEmailToken);

    return {
      status: "success",
      data: {
        message: "Reset password email sent successfully",
      },
    };
  }

  async resetPasswordHandler(input: IResetPasswordInput) {
    const payload = await verifyJwt<{ email: string }>(
      input.token,
      "resetPasswordTokenPublicKey",
    );

    if (!payload) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid token",
      });
    }

    const user = await super.getUserByEmail(payload.email);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(input.password, salt);
    await super.updateUser(user._id, { password: hashedPassword });

    return {
      status: "success",
      data: {
        message: "Password reset successfully",
      },
    };
  }

  async refreshAccessTokenHandler(ctx: Context) {
    // Get the refresh token from cookie
    const { req, res } = ctx;
    const cookies = new Cookies(req, res, {
      secure: process.env.NODE_ENV === "production",
    });
    const refreshToken = cookies.get("refresh_token");

    const errorMessage = "Could not refresh access token.";

    if (!refreshToken) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: errorMessage,
      });
    }

    // Validate the Refresh token
    const decoded = await verifyJwt<{ sub: string }>(
      refreshToken,
      "refreshTokenPublicKey",
    );

    if (!decoded) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: errorMessage,
      });
    }

    // Check if the user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: errorMessage,
      });
    }

    // Check if the user exist
    const user = await this.getUserById(
      JSON.parse(session)._id as Types.ObjectId,
    );

    if (!user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: errorMessage,
      });
    }

    // Sign new access token
    const accessToken = await signJwt(
      { sub: user._id },
      "accessTokenPrivateKey",
      {
        expiresIn: `${defaultConfig.accessTokenExpiresIn}m`,
      },
    );

    // Send the access token as cookie
    cookies.set("access_token", accessToken, accessTokenCookieOptions);
    cookies.set("logged_in", "true", accessTokenCookieOptions);

    return {
      status: "success",
      data: {
        access_token: accessToken,
      },
    };
  }

  async logoutHandler(ctx: Context) {
    try {
      const { req, res, user } = ctx;

      await redisClient.del(String(user._id));

      const cookies = new Cookies(req, res, {
        secure: process.env.NODE_ENV === "production",
      });
      cookies.set("access_token", "", { maxAge: -1 });
      cookies.set("refresh_token", "", { maxAge: -1 });
      cookies.set("logged_in", "", { maxAge: -1 });

      return {
        status: "success",
      };
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: ctx.user._id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }

  async verifyCaptchaHandler(input: string, ctx: Context) {
    try {
      const remoteip = ctx.req.ip
        ? `&remoteip=${encodeURIComponent(ctx.req.ip)}`
        : "";

      const response = await axios.post(
        defaultConfig.turnstileVerifyEndpoint,
        `secret=${encodeURIComponent(process.env.TURNSTILE_SECRET)}&response=${encodeURIComponent(input)}${remoteip}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!response.data.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid captcha. Please try again.",
        });
      }

      return {
        status: "success",
      };
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }

  pusherAuthHandler(input: { socket_id: string }, ctx: Context) {
    return pusher.authenticateUser(input.socket_id, {
      id: ctx.user._id.toString(),
    });
  }
}
