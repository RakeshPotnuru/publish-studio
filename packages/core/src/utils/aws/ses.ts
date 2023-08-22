import type { SendEmailCommandInput } from "@aws-sdk/client-sesv2";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { TRPCError } from "@trpc/server";
import type { Message } from "amqplib";

import defaultConfig from "../../config/app.config";
import { type emailTemplates, rabbitmq } from "../../constants";
import type { ISES } from "../../types/aws.types";
import { rabbitMQConnection } from "../rabbitmq";

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
    template: (typeof emailTemplates)[keyof typeof emailTemplates],
    variables: Record<string, string>,
    from_address: string,
) => {
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
};

export interface IEmail {
    emails: string[];
    template: (typeof emailTemplates)[keyof typeof emailTemplates];
    variables: Record<string, string>;
    from_address: string;
    scheduled_at: Date;
}

export const emailReceiver = async () => {
    try {
        const connection = await rabbitMQConnection();

        if (connection) {
            const channel = await connection.createChannel();

            const queue = rabbitmq.queues.EMAILS;

            await channel.assertQueue(queue, {
                durable: true,
            });
            await channel.prefetch(1);

            console.log(`🐇 Waiting for requests in ${queue} queue.`);

            await channel.consume(queue, message => {
                if (!message) {
                    return;
                }

                const data = JSON.parse(message?.content.toString()) as IEmail;

                sendEmail(data.emails, data.template, data.variables, data.from_address).catch(
                    error => {
                        console.log(error);
                    },
                );

                channel.sendToQueue(
                    message?.properties.replyTo as string,
                    Buffer.from(
                        JSON.stringify({
                            status: "success",
                            job: "email",
                        }),
                    ),
                    {
                        correlationId: message?.properties.correlationId as string,
                    },
                );

                channel.ack(message as Message);
            });
        } else {
            console.log("❌ Failed to connect to RabbitMQ 🐇");
        }
    } catch (error) {
        console.log(error);

        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: defaultConfig.defaultErrorMessage,
        });
    }
};

export const scheduleEmail = async (data: IEmail) => {
    try {
        const connection = await rabbitMQConnection();

        if (connection) {
            const channel = await connection.createChannel();

            const queue = rabbitmq.queues.EMAIL_JOBS;

            await channel.assertQueue(queue, {
                durable: true,
            });

            channel.sendToQueue(
                queue,
                Buffer.from(
                    JSON.stringify({
                        emails: data.emails,
                        template: data.template,
                        // eslint-disable-next-line @typescript-eslint/no-base-to-string
                        variables: data.variables.toString(),
                        from_address: data.from_address,
                        scheduled_at: data.scheduled_at,
                    }),
                ),
            );

            return {
                status: "success",
                data: {
                    message: "Email scheduled successfully",
                },
            };
        } else {
            console.log("❌ Failed to connect to RabbitMQ 🐇");

            return {
                status: "error",
            };
        }
    } catch (error) {
        console.log(error);

        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: defaultConfig.defaultErrorMessage,
        });
    }
};
