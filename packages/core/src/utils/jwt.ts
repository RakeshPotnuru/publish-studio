import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import defaultConfig from "../config/app";
import { logtail } from "./logtail";

export const signJwt = async (
  payload: object,
  key:
    | "accessTokenPrivateKey"
    | "refreshTokenPrivateKey"
    | "verificationTokenPrivateKey"
    | "resetPasswordTokenPrivateKey",
  options: SignOptions = {},
) => {
  try {
    // eslint-disable-next-line security/detect-object-injection
    const privateKey = Buffer.from(defaultConfig[key], "base64").toString(
      "ascii",
    );
    return jwt.sign(payload, privateKey, {
      ...options,
      algorithm: "RS256",
    });
  } catch (error) {
    await logtail.error(JSON.stringify(error));
    console.log(error);

    return null;
  }
};

export const verifyJwt = async <T>(
  token: string,
  key:
    | "accessTokenPublicKey"
    | "refreshTokenPublicKey"
    | "verificationTokenPublicKey"
    | "resetPasswordTokenPublicKey",
): Promise<T | null> => {
  try {
    // eslint-disable-next-line security/detect-object-injection
    const publicKey = Buffer.from(defaultConfig[key], "base64").toString(
      "ascii",
    );
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    await logtail.error(JSON.stringify(error));

    return null;
  }
};
