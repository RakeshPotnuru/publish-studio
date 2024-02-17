import { TRPCError } from "@trpc/server";
import type { RatelimitConfig } from "@upstash/ratelimit";
import { Ratelimit } from "@upstash/ratelimit";
import type { NextFunction } from "express";
import { Redis } from "ioredis";

import { UserType } from "../config/constants";
import type { IUser } from "../modules/user/user.types";

const redis = new Redis(process.env.REDIS_URL);

const adapter = {
  sadd: <TData>(key: string, ...members: TData[]) =>
    redis.sadd(key, ...members.map(String)),
  eval: async <TArgs extends unknown[], TData = unknown>(
    script: string,
    keys: string[],
    args: TArgs,
  ) =>
    redis.eval(
      script,
      keys.length,
      ...keys,
      ...args.map(String),
    ) as Promise<TData>,
};

export const rateLimiter = (limiter: RatelimitConfig["limiter"]) => {
  return {
    free: new Ratelimit({
      redis: adapter,
      limiter,
      // analytics: true, // enable if using @upstash/redis
    }),
    pro: new Ratelimit({
      redis: adapter,
      limiter: limiter,
      // analytics: true, // enable if using @upstash/redis
    }),
    public: new Ratelimit({
      redis: adapter,
      limiter: limiter,
      // analytics: true, // enable if using @upstash/redis
    }),
  };
};

export const rateLimiterMiddleware = (
  limiter: {
    default: RatelimitConfig["limiter"];
    free?: RatelimitConfig["limiter"];
    pro?: RatelimitConfig["limiter"];
  },
  identifier: string,
  user_type?: IUser["user_type"],
) => {
  return async (next: NextFunction) => {
    let isBlocked = false;
    if (user_type === UserType.PRO) {
      const { success } = await rateLimiter(
        limiter.pro ?? limiter.default,
      ).pro.limit(identifier);
      isBlocked = !success;
    } else if (user_type === UserType.FREE) {
      const { success } = await rateLimiter(
        limiter.free ?? limiter.default,
      ).free.limit(identifier);
      isBlocked = !success;
    } else {
      const { success } = await rateLimiter(limiter.default).public.limit(
        identifier,
      );
      isBlocked = !success;
    }

    if (isBlocked) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests. Please wait and try again.",
      });
    } else {
      next();
    }
  };
};
