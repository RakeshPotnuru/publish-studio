import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import superjson from "superjson";
import type { OpenApiMeta } from "trpc-openapi";

import { deserializeUser } from "./middlewares/deserialize-user";
import AuthService from "./modules/auth/auth.service";

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  return await deserializeUser({ req, res });
};

export type Context = inferAsyncReturnType<typeof createContext>;
export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create({
  transformer: superjson,
});

const isAuthenticated = t.middleware(({ next, ctx }) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!ctx.user._id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return next();
});

const isPro = t.middleware(({ next }) => {
  // NOSONAR
  // if (ctx.user.user_type !== UserType.PRO) {
  //   throw new TRPCError({
  //     code: "UNAUTHORIZED",
  //     message: "You must be a pro user to access this resource",
  //   });
  // }
  return next();
});

const isAdmin = t.middleware(async ({ next, ctx }) => {
  const isAdmin = await new AuthService().isAdmin(ctx.user.email);

  if (!isAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be an admin user to access this resource",
    });
  }
  return next();
});

export const router = t.router;
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const proProtectedProcedure = t.procedure
  .use(isAuthenticated)
  .use(isPro);
export const adminProtectedProcedure = t.procedure
  .use(isAuthenticated)
  .use(isAdmin);
