import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";

import defaultConfig from "../../config/app.config";
import { rabbitmq } from "../../constants";
import type { IEmail } from "./email.types";

export const invokeSendEmailRPC = async (data: IEmail) => {
    const connection = await amqp.connect(defaultConfig.rabbitmqUrl);

    if (connection) {
        const channel = await connection.createChannel();

        const q = await channel.assertQueue("", {
            exclusive: true,
            durable: true,
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

        const queue = rabbitmq.queues.EMAILS;

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
            correlationId,
            replyTo: q.queue,
        });
    }
};
