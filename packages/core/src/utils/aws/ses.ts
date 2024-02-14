import type { SendEmailCommandInput } from "@aws-sdk/client-sesv2";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { TRPCError } from "@trpc/server";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";
import type { Types } from "mongoose";

import defaultConfig, { bullMQConnectionOptions } from "../../config/app.config";
import type { EmailTemplate } from "../../config/constants";
import { constants } from "../../config/constants";
import type { ISES } from "../../types/aws.types";
import { logtail } from "../logtail";

const ses = new SESv2Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
} as ISES);

export default ses;

export const sendEmail = async (
    emails: string[],
    template: EmailTemplate,
    variables: Record<string, string>,
    from_address: string,
) => {
    try {
        const input: SendEmailCommandInput = {
            Content: {
                Template: {
                    TemplateName: template,
                    TemplateData: JSON.stringify(variables),
                },
            },
            Destination: {
                ToAddresses: emails,
            },
            FromEmailAddress: from_address,
        };

        const command = new SendEmailCommand(input);
        await ses.send(command);
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
                    job.data.variables as Record<string, string>,
                    job.data.from_address as string,
                );

                return job.data as IEmail;
            },
            {
                connection: bullMQConnectionOptions,
                removeOnComplete: { count: 0 },
                removeOnFail: { count: 0 },
            },
        );

        emailWorker.on("failed", job => {
            logtail
                .error(job?.failedReason ?? "Email job failed due to unknown reason")
                .catch(() => console.log("Error logging failed email job"));
        });

        emailWorker.on("error", error => {
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
