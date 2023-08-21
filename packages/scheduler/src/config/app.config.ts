import type { ConnectionOptions } from "bullmq";

export const connectionOptions: ConnectionOptions = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number.parseInt(process.env.REDIS_PORT, 10) || 6379,
};

interface ICustomConfig {
    rabbitmqUrl: string;
}

const defaultConfig: ICustomConfig = {
    rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://127.0.0.1:5672",
};

export default defaultConfig;
