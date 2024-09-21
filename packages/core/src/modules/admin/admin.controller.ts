import { TRPCError } from "@trpc/server";

import defaultConfig from "../../config/app";
import { EmailTemplate, UserType } from "../../config/constants";
import { logtail } from "../../utils/logtail";
import { sgMail } from "../../utils/sendgrid";
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

  async changeTrialToFree() {
    try {
      await User.updateMany(
        {
          user_type: UserType.TRIAL,
        },
        {
          user_type: UserType.FREE,
        },
      ).exec();

      return { success: true };
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }
}
