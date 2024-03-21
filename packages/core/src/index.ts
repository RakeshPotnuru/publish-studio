import "dotenv/config";

import { TRPCError } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import configcat from "configcat-node";
import type { CorsOptions } from "cors";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import helmet from "helmet";
import { v4 as uuidv4 } from "uuid";

import "./config/env";
import "./utils/db";
import "./wss";

import defaultConfig from "./config/app";
import appRouter from "./routes";
import { createContext } from "./trpc";
import { logtail } from "./utils/logtail";

const app: Application = express();

app.use((_, res, next) => {
  res.locals.nonce = uuidv4();
  next();
});

app.set("trust proxy", 1);

app.use(helmet());

app.use((req, res, next) => {
  if (req.originalUrl === defaultConfig.stripeWebhookPath) {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

const corsOptions: CorsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? (
          origin: string | undefined,
          callback: (error: Error | null, allow?: boolean) => void,
        ) => {
          if (
            !origin ||
            process.env.WHITELIST_ORIGINS.split(",")?.includes(origin)
          ) {
            callback(null, true);
          } else {
            callback(
              new TRPCError({
                code: "UNAUTHORIZED",
                message: "Not allowed by CORS",
              }),
            );
          }
        }
      : "*",
  optionsSuccessStatus: 200,
  credentials: process.env.NODE_ENV === "production",
};

app.use(cors(corsOptions));

app.use("/health", (_, res) => {
  return res.send("OK");
});

app.use(
  "/api",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});

export type AppRouter = typeof appRouter;
export * from "./types";

process.on("uncaughtException", (error) => {
  logtail.error(error).catch((error) => {
    console.log(error);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  logtail
    .error("Unhandled Rejection at: Promise", {
      reason,
      promise,
    })
    .catch((error) => {
      console.log(error);
    });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received");

  configcat.disposeAllClients();

  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received");

  configcat.disposeAllClients();

  process.exit(0);
});
