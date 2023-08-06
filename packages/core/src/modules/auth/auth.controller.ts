import { TRPCError } from "@trpc/server";
import axios from "axios";
import bycrypt from "bcryptjs";
import { getCookie, setCookie } from "cookies-next";
import type { OptionsType } from "cookies-next/lib/types";

import defaultConfig from "../../config/app.config";
import type { Context } from "../../trpc";
import { signJwt, verifyJwt } from "../../utils/jwt";
import redisClient from "../../utils/redis";
import UserService from "../user/user.service";
import type { IUser } from "../user/user.types";

const cookieOptions: OptionsType = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
};

const accessTokenCookieOptions: OptionsType = {
    ...cookieOptions,
    expires: new Date(Date.now() + defaultConfig.accessTokenExpiresIn * 60 * 1000), // milliseconds
};

const refreshTokenCookieOptions: OptionsType = {
    ...cookieOptions,
    expires: new Date(Date.now() + defaultConfig.refreshTokenExpiresIn * 60 * 1000),
};

export default class AuthController extends UserService {
    private async isDisposableEmail(email: string) {
        try {
            const response = await axios.get(`${defaultConfig.kickbox_api_url}/${email}`);
            return response.data.disposable as boolean;
        } catch {
            return false;
        }
    }

    async registerHandler(input: IUser) {
        try {
            if (await this.isDisposableEmail(input.email)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Disposable email is not allowed",
                });
            }

            const user = await super.getUserByEmail(input.email);

            if (user) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Email already exists",
                });
            }

            const hashedPassword = await bycrypt.hash(input.password, 12);
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
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async loginHandler(input: { email: string; password: string }, ctx: Context) {
        try {
            const user = await super.getUserByEmail(input.email);

            if (!user || !(await bycrypt.compare(input.password, user.password))) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid email or password",
                });
            }

            const { access_token, refresh_token } = await super.signTokens(user);
            const { req, res } = ctx;

            setCookie("access_token", access_token, { req, res, ...accessTokenCookieOptions });
            setCookie("refresh_token", refresh_token, { req, res, ...refreshTokenCookieOptions });
            setCookie("logged_in", "true", {
                req,
                res,
                ...accessTokenCookieOptions,
                httpOnly: false,
            });

            return {
                status: "success",
                access_token,
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async refreshAccessTokenHandler(ctx: Context) {
        try {
            // Get the refresh token from cookie
            const { req, res } = ctx;
            const refresh_token = getCookie("refresh_token", { req, res }) as string;

            const errorMessage = "Could not refresh access token.";

            if (!refresh_token) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: errorMessage,
                });
            }

            // Validate the Refresh token
            const decoded = verifyJwt<{ sub: string }>(refresh_token, "refreshTokenPublicKey");

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
            const user = await this.getUserById(JSON.parse(session)._id as string);

            if (!user) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: errorMessage,
                });
            }

            // Sign new access token
            const access_token = signJwt({ sub: user._id }, "accessTokenPrivateKey", {
                expiresIn: `${defaultConfig.accessTokenExpiresIn}m`,
            });

            // Send the access token as cookie
            setCookie("access_token", access_token, { req, res, ...accessTokenCookieOptions });
            setCookie("logged_in", "true", {
                req,
                res,
                ...accessTokenCookieOptions,
                httpOnly: false,
            });

            return {
                status: "success",
                access_token,
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async logoutHandler(ctx: Context) {
        try {
            const { req, res, user } = ctx;

            await redisClient.del(String(user?._id));

            setCookie("access_token", "", { req, res, maxAge: -1 });
            setCookie("refresh_token", "", { req, res, maxAge: -1 });
            setCookie("logged_in", "", { req, res, maxAge: -1 });

            return {
                status: "success",
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
