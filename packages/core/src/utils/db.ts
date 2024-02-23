import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";

import { logtail } from "./logtail";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    if (mongoose.connection.readyState === mongoose.STATES.connected) {
      console.log("✅ Connected to MongoDB 🍃");
    } else {
      console.log("❌ Failed to connect to MongoDB 🍃");
    }
  } catch (error) {
    await logtail.error(JSON.stringify(error));

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "❌ Failed to connect to MongoDB.",
    });
  }
};

await connectDB().catch((error) => {
  console.log(error);
});
