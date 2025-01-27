import { TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import Cookies from "cookies";
import type { NextFunction, Request, Response } from "express";

import defaultConfig from "../config/app";
import User from "../modules/user/user.model";
import type { IUser } from "../modules/user/user.types";
import { verifyJwt } from "../utils/jwt";
import { logtail } from "../utils/logtail";
import redisClient from "../utils/redis";

export const deserializeUser = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  try {
    const cookies = new Cookies(req, res);
    const accessToken = cookies.get("access_token");

    const notAuthenticated = {
      req,
      res,
      user: {} as unknown as IUser,
    };

    if (!accessToken) {
      return notAuthenticated;
    }

    // Validate Access Token
    const decoded = await verifyJwt<{ sub: string }>(
      accessToken,
      "accessTokenPublicKey",
    );

    if (!decoded) {
      return notAuthenticated;
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return notAuthenticated;
    }

    // Check if the user still exists
    const user = await User.findById(JSON.parse(session)._id).exec();

    if (!user) {
      return notAuthenticated;
    }

    return {
      req,
      res,
      user: { ...user.toJSON() },
    };
  } catch (error) {
    await logtail.error(JSON.stringify(error));

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: defaultConfig.defaultErrorMessage,
    });
  }
};

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookies = new Cookies(req, res);
    const accessToken = cookies.get("access_token");

    if (!accessToken) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Validate Access Token
    const decoded = await verifyJwt<{ sub: string }>(
      accessToken,
      "accessTokenPublicKey",
    );

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Check if the user still exists
    const user = await User.findById(JSON.parse(session)._id).exec();

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    await logtail.error(JSON.stringify(error));

    return res.status(500).json({
      message: defaultConfig.defaultErrorMessage,
    });
  }
};
