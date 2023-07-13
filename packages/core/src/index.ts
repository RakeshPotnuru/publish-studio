import "dotenv/config";

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import { auth } from "express-openid-connect";

import "./utils/db";
import "./config/index";

import { config as auth0Config } from "./config/auth0.config";
import avaliableRoutes from "./routes";
import { createContext, router } from "./trpc";

const appRouter = router(avaliableRoutes);

const app: Application = express();

app.use(express.json());
app.use(
    cors({
        origin: "*",
    }),
);

app.use(auth(auth0Config));

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
