import { TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import User from "../modules/user/user.model";
import s3 from "../utils/aws/s3";
import { verifyJwt } from "../utils/jwt";
import redisClient from "../utils/redis";

export const deserializeUser = async ({ req, res }: CreateExpressContextOptions) => {
    try {
        let access_token = "";
        if (req.headers.authorization?.startsWith("Bearer")) {
            access_token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies?.access_token) {
            access_token = req.cookies.access_token;
        }

        const notAuthenticated = {
            req,
            res,
            user: null,
            s3: s3,
        };

        if (!access_token) {
            return notAuthenticated;
        }

        // Validate Access Token
        const decoded = verifyJwt<{ sub: string }>(access_token, "accessTokenPublicKey");

        if (!decoded) {
            return notAuthenticated;
        }

        // Check if user has a valid session
        const session = await redisClient.get(decoded.sub);

        if (!session) {
            return notAuthenticated;
        }

        // Check if the user still exist
        const user = await User.findById(JSON.parse(session)._id).exec();

        if (!user) {
            return notAuthenticated;
        }

        return {
            req,
            res,
            user: { ...user, _id: user._id },
            s3,
        };
    } catch (error: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
        });
    }
};
