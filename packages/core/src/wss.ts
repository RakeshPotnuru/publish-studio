import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";

import appRouter from "./routes";

const wss = new WebSocketServer({
    port: 4001,
});

export const createContext = ({ req, res }: CreateWSSContextFnOptions) => {
    return {
        req: req as never,
        res: res as never,
        user: {} as never,
    };
};

const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext,
});

wss.on("connection", ws => {
    console.log(`++ Connection (${wss.clients.size})`);
    ws.once("close", () => {
        console.log(`-- Connection (${wss.clients.size})`);
    });
});
console.log("✅ WebSocket Server listening on ws://localhost:4001");

process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
    wss.close();
});
