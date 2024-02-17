import "dotenv/config";

import { TRPCError } from "@trpc/server";
import { createClient } from "redis";

import { logtail } from "./logtail";

const redisUrl = process.env.REDIS_URL;
const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient
      .on("error", (error: Error) => console.log("❌ Redis Error:", error))
      .connect();
    console.log("✅ Connected to Redis 📦");
  } catch (error) {
    await logtail.error(JSON.stringify(error));

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "❌ Failed to connect to redis.",
    });
  }
};

await connectRedis();

export default redisClient;
