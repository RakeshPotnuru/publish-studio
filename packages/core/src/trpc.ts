import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import { constants } from "./constants";
import { deserializeUser } from "./middlewares/deserialize-user";

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
    return deserializeUser({ req, res });
};

export type Context = inferAsyncReturnType<typeof createContext>;
export const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to access this resource",
        });
    }
    return next();
});

const isPro = t.middleware(({ next, ctx }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to access this resource",
        });
    }

    if (ctx.user.user_type !== constants.user.userTypes.PRO) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be a pro user to access this resource",
        });
    }
    return next();
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const protectedProcedure = t.procedure.use(isAuthed);
export const proProtectedProcedure = t.procedure.use(isPro);
