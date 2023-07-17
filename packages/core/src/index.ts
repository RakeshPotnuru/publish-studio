import "dotenv/config";

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import type { Application } from "express";
import express from "express";

import "./utils/db";
import "./config/index";

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

app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`);
});

export type AppRouter = typeof trpcRouter;
