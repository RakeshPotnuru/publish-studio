import "dotenv/config";

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { CorsOptions } from "cors";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import { renderTrpcPanel } from "trpc-panel";

import "./utils/db";
import "./config/env";

import defaultConfig from "./config/app.config";
import ProjectController from "./modules/project/project.controller";
import trpcRouter from "./routes";
import { createContext } from "./trpc";
import { emailReceiver } from "./utils/aws/ses";

const app: Application = express();

app.use((req, res, next) => {
    if (req.originalUrl === "/api/stripeWebhook") {
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
                  if (origin && defaultConfig.whitelist_origins?.includes(origin)) {
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
        router: trpcRouter,
        createContext,
    }),
);

app.use("/panel", (_, res) => {
    return res.send(renderTrpcPanel(trpcRouter, { url: defaultConfig.baseUrl }));
});

const project = new ProjectController();
await project.postReceiver();
await emailReceiver();

app.listen(defaultConfig.port, () => {
    console.log(`✅ Server running on port ${defaultConfig.port}`);
});

export type AppRouter = typeof trpcRouter;
