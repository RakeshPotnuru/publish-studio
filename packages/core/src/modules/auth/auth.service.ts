import { TRPCError } from "@trpc/server";
import axios from "axios";
import configcat from "configcat-node";

import defaultConfig from "../../config/app.config";
import { EmailTemplate } from "../../config/constants";
import { createCaller } from "../../routes";
import type { Context } from "../../trpc";
import { configCatClient } from "../../utils/configcat";
import { signJwt } from "../../utils/jwt";
import { logtail } from "../../utils/logtail";
import redisClient from "../../utils/redis";
import { sendEmail } from "../../utils/sendgrid";
import InviteController from "../admin/invite/invite.controller";
import UserService from "../user/user.service";
import type { IUser } from "../user/user.types";

export default class AuthService extends UserService {
  async isDisposableEmail(email: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${defaultConfig.kickboxApiUrl}/${email}`
      );
      return response.data.disposable as boolean;
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      return false;
    }
  }

  async isEmailWhitelisted(email: string): Promise<boolean> {
    const invite = await new InviteController().getInviteByEmail(email);

    return invite?.is_invited ?? false;
  }

  async isAdmin(email: string): Promise<boolean> {
    return await configCatClient.getValueAsync(
      "isAdmin",
      false,
      new configcat.User(email, email)
    );
  }

  async sendWelcomeEmail(user: IUser, ctx: Context) {
    await sendEmail(
      [user.email],
      EmailTemplate.WELCOME_EMAIL,
      process.env.FROM_EMAIL_PERSONAL,
      {
        first_name: user.first_name,
      },
      Math.floor(Date.now() / 1000) + 5 * 60 // 5 minutes from now
    );

    await createCaller(ctx).notifications.create({
      type: "welcome",
      message: `Welcome to ${defaultConfig.appName}! Feel free to reach out to support by clicking "?" button if you have any questions.`,
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await sendEmail(
      [email],
      EmailTemplate.VERIFY_EMAIL,
      process.env.FROM_EMAIL_AUTO,
      {
        verification_url: verificationUrl,
      }
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
        process.env.FROM_EMAIL_AUTO,
        {
          reset_password_url: resetPasswordUrl,
        }
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

      const refresh_token = signJwt(
        { sub: user._id },
        "refreshTokenPrivateKey",
        {
          expiresIn: `${defaultConfig.refreshTokenExpiresIn}m`,
        }
      );

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
