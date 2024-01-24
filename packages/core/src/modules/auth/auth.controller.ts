import { TRPCError } from "@trpc/server";
import axios from "axios";
import bycrypt from "bcryptjs";
import { getCookie, setCookie } from "cookies-next";
import type { OptionsType } from "cookies-next/lib/types";
import { verify } from "hcaptcha";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app.config";
import { constants } from "../../config/constants";
import type { Context } from "../../trpc";
import { scheduleEmail, sendEmail } from "../../utils/aws/ses";
import { verifyGoogleToken } from "../../utils/google/auth";
import { signJwt, verifyJwt } from "../../utils/jwt";
import redisClient from "../../utils/redis";
import type { ILoginInput, IRegisterInput, IResetPasswordInput } from "../auth/auth.types";
import UserService from "../user/user.service";

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

    private async sendVerificationEmail(email: string, token: string) {
        const verification_url = `${defaultConfig.client_url}/verify-email?token=${token}`;

        await sendEmail(
            [email],
            constants.emailTemplates.VERIFY_EMAIL,
            {
                verification_url: verification_url,
            },
            process.env.AWS_SES_AUTO_FROM_EMAIL,
        );

        return {
            status: "success",
            data: {
                message: "Verification email sent successfully",
            },
        };
    }

    private async sendResetPasswordEmail(email: string, token: string) {
        try {
            const reset_password_url = `${defaultConfig.client_url}/reset-password?token=${token}`;

            await sendEmail(
                [email],
                constants.emailTemplates.RESET_PASSWORD,
                {
                    reset_password_url: reset_password_url,
                },
                process.env.AWS_SES_AUTO_FROM_EMAIL,
            );

            return {
                status: "success",
                data: {
                    message: "Reset password email sent successfully",
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

        const token = signJwt({ email: user.email }, "verificationTokenPrivateKey", {
            expiresIn: `${defaultConfig.verificationTokenExpiresIn}m`,
        });

        if (!token) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }

        return await this.sendVerificationEmail(user.email, token);
    }

    async verifyEmailHandler(input: { token: string }) {
        const payload = verifyJwt<{ email: string }>(input.token, "verificationTokenPublicKey");

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

        await super.updateUser(user._id, { is_verified: true });

        await scheduleEmail({
            emails: [user.email],
            template: constants.emailTemplates.WELCOME_EMAIL,
            variables: {
                first_name: user.first_name,
                last_name: user.last_name,
            },
            from_address: process.env.AWS_SES_PERSONAL_FROM_EMAIL,
            scheduled_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        });

        return {
            status: "success",
            data: {
                message: "User verified successfully",
            },
        };
    }

    async registerHandler(input: IRegisterInput) {
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
                message: "This email is associated with an existing account. Please login instead.",
            });
        }

        const verification_token = signJwt({ email: input.email }, "verificationTokenPrivateKey", {
            expiresIn: `${defaultConfig.verificationTokenExpiresIn}m`,
        });

        if (!verification_token) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }

        await this.sendVerificationEmail(input.email, verification_token);

        if (!input.password) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Password is required",
            });
        }

        const hashed_password = await bycrypt.hash(input.password, 12);
        const newUser = await super.createUser({
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            password: hashed_password,
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

        if (!user) {
            const newUser = await super.createUser({
                first_name: payload.given_name,
                last_name: payload.family_name,
                email: payload.email,
                profile_pic: payload.picture,
                user_type: constants.user.userTypes.FREE,
                auth_modes: [constants.user.authModes.GOOGLE],
                google_sub: payload.sub,
                is_verified: true,
            });

            const { access_token, refresh_token } = await super.signTokens(newUser);

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
                data: {
                    access_token,
                    user: newUser,
                },
            };
        }

        if (!user.auth_modes.includes(constants.user.authModes.GOOGLE)) {
            await super.updateUser(user._id, {
                auth_modes: [...user.auth_modes, constants.user.authModes.GOOGLE],
                google_sub: payload.sub,
            });

            if (!user.profile_pic && payload.picture) {
                await super.updateUser(user._id, { profile_pic: payload.picture });
            }
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
            data: {
                access_token,
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

        if (!user || (user.password && !(await bycrypt.compare(input.password, user.password)))) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid email or password",
            });
        }

        if (!user.is_verified) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: constants.errorCauses.VERIFICATION_PENDING,
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

        await super.updateUser(user._id, { last_login: new Date() });

        return {
            status: "success",
            data: {
                access_token,
                user,
            },
        };
    }

    async sendResetPasswordEmailHandler(input: { email: string }) {
        const user = await super.getUserByEmail(input.email);

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "This email is not associated with any account. Please register instead.",
            });
        }

        if (!user.is_verified) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                    "Please verify your email first. Check your inbox for the verification email.",
            });
        }

        const resetEmailToken = signJwt({ email: input.email }, "resetPasswordTokenPrivateKey", {
            expiresIn: `${defaultConfig.resetPasswordTokenExpiresIn}m`,
        });

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
        const payload = verifyJwt<{ email: string }>(input.token, "resetPasswordTokenPublicKey");

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

        const hashedPassword = await bycrypt.hash(input.password, 12);
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
        const refreshToken = getCookie("refresh_token", { req, res });

        const errorMessage = "Could not refresh access token.";

        if (!refreshToken) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: errorMessage,
            });
        }

        // Validate the Refresh token
        const decoded = verifyJwt<{ sub: string }>(refreshToken, "refreshTokenPublicKey");

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
        const user = await this.getUserById(JSON.parse(session)._id as Types.ObjectId);

        if (!user) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: errorMessage,
            });
        }

        // Sign new access token
        const accessToken = signJwt({ sub: user._id }, "accessTokenPrivateKey", {
            expiresIn: `${defaultConfig.accessTokenExpiresIn}m`,
        });

        // Send the access token as cookie
        setCookie("access_token", accessToken, { req, res, ...accessTokenCookieOptions });
        setCookie("logged_in", "true", {
            req,
            res,
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

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

    async verifyCaptchaHandler(input: string) {
        try {
            const { success } = await verify(process.env.HCAPTCHA_SECRET, input);

            if (!success) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid captcha. Please try again.",
                });
            }

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
