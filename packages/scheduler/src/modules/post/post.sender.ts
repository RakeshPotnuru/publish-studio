import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";

import defaultConfig from "../../config/app.config";
import { rabbitmq } from "../../constants";
import type { IPost } from "./post.types";

export const invokePublishPostRPC = async (data: IPost) => {
    const connection = await amqp.connect(defaultConfig.rabbitmqUrl);

    if (connection) {
        const channel = await connection.createChannel();

        const q = await channel.assertQueue("", {
            exclusive: true,
        });

        const correlationId = uuidv4();

        await channel.consume(
            q.queue,
            message => {
                if (message?.properties.correlationId === correlationId) {
                    console.log(`✅ Got ${message?.content.toString()}`);
                }
            },
            {
                noAck: true,
            },
        );

        const queue = rabbitmq.queues.POSTS;

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
            correlationId,
            replyTo: q.queue,
        });
    }
};
