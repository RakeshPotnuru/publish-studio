import type { Message } from "amqplib";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";

import { connectionOptions } from "../../config/app.config";
import { bullmq, rabbitmq } from "../../constants";
import { rabbitMQConnection } from "../../utils/rabbitmq";
import { invokePublishPostRPC } from "./post.sender";
import type { IPost } from "./post.types";

const postQueue = new Queue(bullmq.queues.POST, { connection: connectionOptions });

const schedulePost = async (data: IPost) => {
    try {
        const delay = Number(new Date(data.scheduled_at)) - Date.now();
        console.log(delay);

        await postQueue.add(`${bullmq.queues.POST}-job-${data.project_id}`, data, { delay });
    } catch (error) {
        console.log("❌ Failed to schedule post");

        console.error(error);
    }
};

export const postJobsReceiver = async () => {
    try {
        const connection = await rabbitMQConnection();

        if (connection) {
            const channel = await connection.createChannel();

            const queue = rabbitmq.queues.JOBS;

            await channel.assertQueue(queue, {
                durable: true,
            });
            await channel.prefetch(1);

            console.log(`🐇 Waiting for requests in ${queue} queue.`);

            await channel.consume(queue, async message => {
                if (!message) {
                    return;
                }

                const data = JSON.parse(message?.content.toString());

                await schedulePost(data as IPost);

                const worker = new Worker(
                    bullmq.queues.POST,
                    async (job: Job) => {
                        console.log(
                            `✅ Scheduled post ${job.id ?? ""} at ${job.data.date as string}`,
                        );

                        await invokePublishPostRPC(data as IPost);

                        return job.data as IPost;
                    },
                    { connection: connectionOptions },
                );

                worker.on("completed", (job: Job) => {
                    console.log(`✅ Completed job ${job.id ?? ""} at ${job.data.date as string}`);
                });

                worker.on("failed", () => {
                    console.log("❌ Job Failed");
                });

                channel.ack(message as Message);
            });
        } else {
            console.log("❌ Failed to connect to RabbitMQ");
        }
    } catch (error) {
        console.log(error);
    }
};
