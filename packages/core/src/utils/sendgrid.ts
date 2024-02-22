import type { MailDataRequired } from "@sendgrid/mail";
import sgMail from "@sendgrid/mail";
import { TRPCError } from "@trpc/server";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";
import type { Types } from "mongoose";

import defaultConfig, { bullMQConnectionOptions } from "../config/app.config";
import type { EmailTemplate } from "../config/constants";
import { constants } from "../config/constants";
import { logtail } from "./logtail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (
  emails: string[],
  template: EmailTemplate,
  from_address: MailDataRequired["from"],
  variables?: MailDataRequired["dynamicTemplateData"]
) => {
  try {
    const input: MailDataRequired = {
      from: from_address,
      isMultiple: true,
      templateId: template,
      personalizations: emails.map((email) => ({
        to: [{ email }],
        dynamicTemplateData: { ...variables, email },
      })),
    };

    await sgMail.send(input);
  } catch (error) {
    await logtail.error(JSON.stringify(error));

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: defaultConfig.defaultErrorMessage,
    });
  }
};

export interface IEmail {
  emails: string[];
  template: EmailTemplate;
  variables: Record<string, string>;
  from_address: string;
  scheduled_at: Date;
  user_id: Types.ObjectId;
}

export const scheduleEmail = async (data: IEmail) => {
  try {
    const emailQueue = new Queue(constants.bullmq.queues.EMAIL, {
      connection: bullMQConnectionOptions,
    });

    const delay = Number(new Date(data.scheduled_at)) - Date.now();

    await emailQueue.add(`${constants.bullmq.queues.EMAIL}-job`, data, {
      delay,
      removeOnComplete: true,
      removeOnFail: true,
    });
    await emailQueue.trimEvents(10);

    const emailWorker = new Worker<IEmail, IEmail>(
      constants.bullmq.queues.EMAIL,
      async (job: Job) => {
        await sendEmail(
          job.data.emails as string[],
          job.data.template as EmailTemplate,
          job.data.from_address as string,
          job.data.variables as Record<string, string>
        );

        return job.data as IEmail;
      },
      {
        connection: bullMQConnectionOptions,
        removeOnComplete: { count: 0 },
        removeOnFail: { count: 0 },
      }
    );

    emailWorker.on("failed", (job) => {
      logtail
        .error(job?.failedReason ?? "Email job failed due to unknown reason")
        .catch(() => console.log("Error logging failed email job"));
    });

    emailWorker.on("error", (error) => {
      logtail
        .error(JSON.stringify(error))
        .catch(() => console.log("Error logging email job error"));
    });
  } catch (error) {
    await logtail.error(JSON.stringify(error), {
      user_id: data.user_id,
    });
  }
};
