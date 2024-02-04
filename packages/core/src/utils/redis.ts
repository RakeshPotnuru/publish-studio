import "dotenv/config";

import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;
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
