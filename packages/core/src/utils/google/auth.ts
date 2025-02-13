import { TRPCError } from "@trpc/server";
import { OAuth2Client } from "google-auth-library";

import { logtail } from "../logtail";

const gOAuth = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

export default gOAuth;

export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await gOAuth.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });

    return ticket.getPayload() as {
      sub: string;
      given_name?: string;
      family_name?: string;
      email: string;
      picture?: string;
    };
  } catch (error) {
    await logtail.error(JSON.stringify(error));

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid Google token",
    });
  }
};
