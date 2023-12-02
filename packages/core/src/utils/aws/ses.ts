import type { SendEmailCommandInput } from "@aws-sdk/client-sesv2";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { TRPCError } from "@trpc/server";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";

import defaultConfig, { bullMQConnectionOptions } from "../../config/app.config";
import { constants } from "../../constants";
import type { ISES } from "../../types/aws.types";

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
    template: (typeof constants.emailTemplates)[keyof typeof constants.emailTemplates],
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
        console.log(error);

        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: defaultConfig.defaultErrorMessage,
        });
    }
};

export interface IEmail {
    emails: string[];
    template: (typeof constants.emailTemplates)[keyof typeof constants.emailTemplates];
    variables: Record<string, string>;
    from_address: string;
    scheduled_at: Date;
}

export const scheduleEmail = async (data: IEmail) => {
    try {
        const emailQueue = new Queue(constants.bullmq.queues.EMAIL, {
            connection: bullMQConnectionOptions,
        });

        const delay = Number(new Date(data.scheduled_at)) - Date.now();
        console.log(`⏰ Sending email in ${delay}ms`);

        await emailQueue.add(`${constants.bullmq.queues.EMAIL}-job`, data, {
            delay,
            removeOnComplete: true,
            removeOnFail: true,
        });

        const worker = new Worker<IEmail, IEmail>(
            constants.bullmq.queues.EMAIL,
            async (job: Job) => {
                await sendEmail(
                    job.data.emails as string[],
                    job.data
                        .template as (typeof constants.emailTemplates)[keyof typeof constants.emailTemplates],
                    job.data.variables as Record<string, string>,
                    job.data.from_address as string,
                );

                console.log(`✅ Sent email ${job.id ?? ""} at ${job.data.scheduled_at as string}`);
                return job.data as IEmail;
            },
            { connection: bullMQConnectionOptions },
        );

        worker.on("completed", (job: Job) => {
            console.log(`✅ Completed scheduled email ${job.id ?? ""}`);
        });

        worker.on("failed", () => {
            console.log("❌ Job Failed");
        });

        worker.on("error", error => {
            console.log(error);
        });
    } catch (error) {
        console.log("❌ Failed to schedule email");

        console.log(error);
    }
};
