import "dotenv/config";

import { TRPCError } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import configcat from "configcat-node";
import type { CorsOptions } from "cors";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import helmet from "helmet";
import { createOpenApiExpressMiddleware } from "trpc-openapi";

import "./config/env";
import "./utils/db";

import defaultConfig from "./config/app";
import { authMiddleware } from "./middlewares/deserialize-user";
import appRouter, { expRouter } from "./routes";
import { createContext } from "./trpc";
import { logtail } from "./utils/logtail";

const app: Application = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use((req, res, next) => {
  if (req.originalUrl === defaultConfig.paddleWebhookPath) {
    if (defaultConfig.paddleIpAddresses.includes(req.ip || "")) {
      express.raw({ type: "application/json" })(req, res, next);
    } else {
      res.status(403).send("Forbidden");
    }
  } else {
    express.json({ limit: "1000kb" })(req, res, next);
  }
});

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin || process.env.WHITELIST_ORIGINS.split(",")?.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not allowed by CORS",
        }),
      );
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/health", (_, res) => {
  return res.send("OK");
});

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.use(
  "/rest",
  createOpenApiExpressMiddleware({ router: appRouter, createContext }),
);

app.use("/api", authMiddleware, expRouter);

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
