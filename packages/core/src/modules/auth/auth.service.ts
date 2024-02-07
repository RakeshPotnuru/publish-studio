import { TRPCError } from "@trpc/server";
import axios from "axios";

import defaultConfig from "../../config/app.config";
import { EmailTemplate } from "../../config/constants";
import { createCaller } from "../../routes";
import type { Context } from "../../trpc";
import { scheduleEmail, sendEmail } from "../../utils/aws/ses";
import { signJwt } from "../../utils/jwt";
import { logtail } from "../../utils/logtail";
import redisClient from "../../utils/redis";
import UserService from "../user/user.service";
import type { IUser } from "../user/user.types";

export default class AuthService extends UserService {
    async isDisposableEmail(email: string) {
        try {
            const response = await axios.get(`${defaultConfig.kickboxApiUrl}/${email}`);
            return response.data.disposable as boolean;
        } catch (error) {
            await logtail.error(JSON.stringify(error));

            return false;
        }
    }

    async sendWelcomeEmail(user: IUser, ctx: Context) {
        await scheduleEmail({
            emails: [user.email],
            template: EmailTemplate.WELCOME_EMAIL,
            variables: {
                first_name: user.first_name,
                last_name: user.last_name,
            },
            from_address: process.env.AWS_SES_PERSONAL_FROM_EMAIL,
            scheduled_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
            user_id: user._id,
        });

        await createCaller(ctx).notifications.create({
            type: "welcome",
            message: `Welcome to ${process.env.APP_NAME}! Feel free to reach out to support by clicking "?" button if you have any questions.`,
        });
    }

    async sendVerificationEmail(email: string, token: string) {
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

        await sendEmail(
            [email],
            EmailTemplate.VERIFY_EMAIL,
            {
                verification_url: verificationUrl,
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

    async sendResetPasswordEmail(email: string, token: string) {
        try {
            const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

            await sendEmail(
                [email],
                EmailTemplate.RESET_PASSWORD,
                {
                    reset_password_url: resetPasswordUrl,
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
            await logtail.error(JSON.stringify(error));

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async signTokens(user: IUser) {
        try {
            const userId = user._id.toString();

            await redisClient.set(userId, JSON.stringify(user), {
                EX: defaultConfig.redisCacheExpiresIn * 60,
            });

            const access_token = signJwt({ sub: user._id }, "accessTokenPrivateKey", {
                expiresIn: `${defaultConfig.accessTokenExpiresIn}m`,
            });

            const refresh_token = signJwt({ sub: user._id }, "refreshTokenPrivateKey", {
                expiresIn: `${defaultConfig.refreshTokenExpiresIn}m`,
            });

            return { access_token, refresh_token };
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id: user._id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
