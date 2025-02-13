import { z } from "zod";

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof ZodEnvironmentVariables> {}
  }
}

const ZodEnvironmentVariables = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  MONGO_URI: z.string(),
  REDIS_URL: z.string().url(),
  REDIS_PORT: z.string(),
  REDIS_HOST: z.string(),
  ACCESS_TOKEN_PRIVATE_KEY: z.string(),
  ACCESS_TOKEN_PUBLIC_KEY: z.string(),
  REFRESH_TOKEN_PRIVATE_KEY: z.string(),
  REFRESH_TOKEN_PUBLIC_KEY: z.string(),
  VERIFICATION_TOKEN_PRIVATE_KEY: z.string(),
  VERIFICATION_TOKEN_PUBLIC_KEY: z.string(),
  RESET_PASSWORD_TOKEN_PRIVATE_KEY: z.string(),
  RESET_PASSWORD_TOKEN_PUBLIC_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_REGION: z.string(),
  FROM_EMAIL_AUTO: z.string(),
  FROM_EMAIL_PERSONAL: z.string(),
  FROM_EMAIL_SUPPORT: z.string(),
  WHITELIST_ORIGINS: z.string(),
  CLIENT_URL: z.string().url(),
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  GOOGLE_GEMINI_API_KEY: z.string(),
  PADDLE_API_KEY: z.string(),
  PADDLE_WEBHOOK_SECRET: z.string(),
  IBM_WATSON_API_KEY: z.string(),
  IBM_WATSON_SERVICE_URL: z.string().url(),
  WORDPRESS_CLIENT_ID: z.string(),
  WORDPRESS_CLIENT_SECRET: z.string(),
  PEXELS_API_KEY: z.string(),
  UNSPLASH_ACCESS_KEY: z.string(),
  TURNSTILE_SECRET: z.string(),
  DB_ENCRYPTION_SECRET: z.string(),
  LOGTAIL_SOURCE_TOKEN: z.string(),
  CONFIGCAT_SDK_KEY: z.string(),
  SENDGRID_API_KEY: z.string(),
  SITE_ENV: z.string(),
  PUSHER_APP_ID: z.string(),
  PUSHER_KEY: z.string(),
  PUSHER_SECRET: z.string(),
  PUSHER_CLUSTER: z.string(),
});

ZodEnvironmentVariables.parse(process.env);

console.log("✅ Environment variables verified!");
