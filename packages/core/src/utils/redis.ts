import "dotenv/config";

import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;
const redisClient = createClient({
    url: redisUrl,
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("✅ Redis client connected");
    } catch (error: any) {
        console.log(error.message);
    }
};

await connectRedis();

redisClient.on("error", (error: Error) => console.log(error));

export default redisClient;
