import "dotenv/config";

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import { renderTrpcPanel } from "trpc-panel";

import "./utils/db";
import "./config/index";

import defaultConfig from "./config/app.config";
import trpcRouter from "./routes";
import { createContext } from "./trpc";

const app: Application = express();

app.use(express.json());
app.use(
    cors({
        origin: "*",
    }),
);

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

app.listen(defaultConfig.port, () => {
    console.log(`✅ Server running on port ${defaultConfig.port}`);
});

export type AppRouter = typeof trpcRouter;
