import type { ConnectionOptions } from "bullmq";
import { Redis } from "ioredis";

interface ICustomConfig {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  verificationTokenExpiresIn: number;
  resetPasswordTokenExpiresIn: number;
  accessTokenPrivateKey: string;
  refreshTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPublicKey: string;
  verificationTokenPrivateKey: string;
  verificationTokenPublicKey: string;
  redisCacheExpiresIn: number;
  defaultErrorMessage: string;
  hashnodeApiUrl: string;
  devToApiUrl: string;
  mediumApiUrl: string;
  wordPressApiUrl: string;
  wordPressRedirectUri: string;
  bloggerRedirectUri: string;
  kickboxApiUrl: string;
  appName: string;
  resetPasswordTokenPrivateKey: string;
  resetPasswordTokenPublicKey: string;
  turnstileVerifyEndpoint: string;
  stripeWebhookPath: string;
  r2Endpoint: string;
  assetsUrl: string;
}

const defaultConfig: ICustomConfig = {
  accessTokenExpiresIn: 1440, // 24 hours
  refreshTokenExpiresIn: 10_080, // 7 days
  verificationTokenExpiresIn: 60, // 1 hour
  resetPasswordTokenExpiresIn: 60, // 1 hour
  redisCacheExpiresIn: 10_080, // 7 days
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
  verificationTokenPrivateKey: process.env.VERIFICATION_TOKEN_PRIVATE_KEY,
  verificationTokenPublicKey: process.env.VERIFICATION_TOKEN_PUBLIC_KEY,
  resetPasswordTokenPrivateKey: process.env.RESET_PASSWORD_TOKEN_PRIVATE_KEY,
  resetPasswordTokenPublicKey: process.env.RESET_PASSWORD_TOKEN_PUBLIC_KEY,
  defaultErrorMessage: "Something went wrong. Please try again later.",
  hashnodeApiUrl: "https://gql.hashnode.com",
  devToApiUrl: "https://dev.to/api",
  mediumApiUrl: "https://api.medium.com/v1",
  wordPressApiUrl: "https://public-api.wordpress.com",
  wordPressRedirectUri: `${process.env.CLIENT_URL}/settings/connections/connect-wp`,
  bloggerRedirectUri: `${process.env.CLIENT_URL}/settings/connections/connect-blogger`,
  kickboxApiUrl: "https://open.kickbox.com/v1/disposable",
  appName: "Publish Studio",
  turnstileVerifyEndpoint:
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  stripeWebhookPath: "/api/payment.stripeWebhook",
  r2Endpoint:
    "https://7f5708cb8ffd7ebc4099df644b1f66c7.r2.cloudflarestorage.com",
  assetsUrl:
    process.env.NODE_ENV === "production"
      ? "https://assets.publishstudio.one"
      : "https://stg.assets.publishstudio.one",
};

export const bullMQConnectionOptions: ConnectionOptions = new Redis(
  process.env.REDIS_URL,
  {
    maxRetriesPerRequest: null,
    retryStrategy: function (times: number) {
      return Math.max(Math.min(Math.exp(times), 20_000), 1000);
    },
  }
);

export default defaultConfig;
