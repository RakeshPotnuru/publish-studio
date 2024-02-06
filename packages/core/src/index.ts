import "dotenv/config";

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { CorsOptions } from "cors";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import { renderTrpcPanel } from "trpc-panel";

import "./config/env";
import "./utils/db";
import "./wss";

import defaultConfig from "./config/app.config";
import appRouter from "./routes";
import { createContext } from "./trpc";

const app: Application = express();

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
                  if (origin && process.env.WHITELIST_ORIGINS.split(",")?.includes(origin)) {
                      callback(null, true);
                  } else {
                      callback(new Error("Not allowed by CORS"));
                  }
              }
            : "*",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(
    "/api",
    createExpressMiddleware({
        router: appRouter,
        createContext,
    }),
);

app.use("/panel", (_, res) => {
    return res.send(renderTrpcPanel(appRouter, { url: process.env.BASE_URL }));
});

app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`);
});

export type AppRouter = typeof appRouter;
export * from "./types";
