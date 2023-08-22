import type { Message } from "amqplib";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";

import { connectionOptions } from "../../config/app.config";
import { bullmq, rabbitmq } from "../../constants";
import { rabbitMQConnection } from "../../utils/rabbitmq";
import { invokeSendEmailRPC } from "./email.sender";
import type { IEmail } from "./email.types";

const emailQueue = new Queue(bullmq.queues.EMAIL, { connection: connectionOptions });

const scheduleEmail = async (data: IEmail) => {
    try {
        const delay = Number(new Date(data.scheduled_at)) - Date.now();

        await emailQueue.add(`${bullmq.queues.EMAIL}-job`, data, { delay });
    } catch (error) {
        console.log("❌ Failed to schedule email");

        console.log(error);
    }
};

export const emailJobsReceiver = async () => {
    try {
        const connection = await rabbitMQConnection();

        if (connection) {
            const channel = await connection.createChannel();

            const queue = rabbitmq.queues.EMAIL_JOBS;

            await channel.assertQueue(queue, {
                durable: true,
            });
            await channel.prefetch(1);

            console.log(`🐇 Waiting for requests in ${queue} queue.`);

            await channel.consume(queue, message => {
                if (!message) {
                    return;
                }

                const data = JSON.parse(message?.content.toString());

                scheduleEmail(data as IEmail).catch(error => {
                    console.log(error);
                });

                const worker = new Worker(
                    bullmq.queues.EMAIL,
                    async (job: Job) => {
                        console.log(
                            `✅ Scheduled email ${job.id ?? ""} at ${
                                job.data.scheduled_at as string
                            }`,
                        );

                        await invokeSendEmailRPC(data as IEmail);

                        return job.data as IEmail;
                    },
                    { connection: connectionOptions },
                );

                worker.on("completed", async (job: Job) => {
                    await job.remove();

                    console.log(`✅ Completed email job ${job.id ?? ""}`);
                });

                worker.on("failed", () => {
                    console.log("❌ Job Failed");
                });

                channel.ack(message as Message);
            });
        }
    } catch (error) {
        console.log(error);
    }
};
