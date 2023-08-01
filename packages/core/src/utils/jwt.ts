import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import defaultConfig from "../config/app.config";

export const signJwt = (
    payload: object,
    key: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options: SignOptions = {},
) => {
    const privateKey = Buffer.from(defaultConfig[key], "base64").toString("ascii");
    return jwt.sign(payload, privateKey, {
        ...options,
        algorithm: "RS256",
    });
};

export const verifyJwt = <T>(
    token: string,
    key: "accessTokenPublicKey" | "refreshTokenPublicKey",
): T | null => {
    try {
        const publicKey = Buffer.from(defaultConfig[key], "base64").toString("ascii");
        return jwt.verify(token, publicKey) as T;
    } catch (error) {
        console.log(error);
        return null;
    }
};
