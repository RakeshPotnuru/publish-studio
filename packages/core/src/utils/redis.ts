import "dotenv/config";

import { createClient } from "redis";

import { logtail } from "./logtail";

const redisUrl = process.env.REDIS_URL;
const redisClient = createClient({
    url: redisUrl,
    socket: {
        tls: process.env.NODE_ENV === "production",
    },
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("✅ Connected to Redis 📦");
    } catch (error) {
        await logtail.error(JSON.stringify(error));
    }
};

await connectRedis();

redisClient.on("error", (error: Error) => console.log(error));

export default redisClient;
