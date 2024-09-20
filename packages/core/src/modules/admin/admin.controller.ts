import { TRPCError } from "@trpc/server";

import defaultConfig from "../../config/app";
import { constants, EmailTemplate } from "../../config/constants";
import { logtail } from "../../utils/logtail";
import { sgMail } from "../../utils/sendgrid";
import AuthHelpers from "../auth/auth.helpers";
import User from "../user/user.model";

export default class AdminController {
  async sendTosNoticeHandler() {
    try {
      const users = await User.find({}).exec();
      const sendAt = Math.floor(Date.now() / 1000);

      await sgMail.send({
        from: process.env.FROM_EMAIL_AUTO,
        isMultiple: true,
        templateId: EmailTemplate.TOS_NOTICE,
        personalizations: users.map((user, i) => ({
          to: [{ email: user.email }],
          dynamicTemplateData: {
            first_name: user.first_name,
            email: user.email,
          },
          sendAt: sendAt + i * 60, // 1 minute after the previous email
        })),
      });

      return { success: true };
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }

  private authHelpers: AuthHelpers;

  constructor() {
    this.authHelpers = new AuthHelpers();
  }

  async startFreeTrialHandler() {
    try {
      const users = await User.find({ user_type: "free" }).exec();

      let successCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          const delay = constants.FREE_TRIAL_TIME;

          await this.authHelpers.startFreeTrial(user, delay);
          await User.updateOne(
            { _id: user._id },
            { user_type: "trial" },
          ).exec();

          successCount++;
        } catch (userError) {
          errorCount++;
          await logtail.warn(
            `Failed to start trial for user ${user._id.toString()}: ${JSON.stringify(userError)}`,
          );
        }
      }

      await logtail.info(
        `Processed ${users.length} users. Success: ${successCount}, Errors: ${errorCount}`,
      );

      return {
        success: true,
        totalProcessed: users.length,
        successCount,
        errorCount,
      };
    } catch (error) {
      await logtail.error(
        `Error in startFreeTrialHandler: ${JSON.stringify(error)}`,
      );

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }
}
