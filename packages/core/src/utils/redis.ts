import "dotenv/config";

import { createClient } from "redis";

import defaultConfig from "../config/app.config";

const redisUrl = defaultConfig.redis_url;
const redisClient = createClient({
    url: redisUrl,
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("✅ Connected to Redis 📦");
    } catch (error) {
        console.log(error);
    }
};

await connectRedis();

redisClient.on("error", (error: Error) => console.log(error));

export default redisClient;
