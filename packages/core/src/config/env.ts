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
    WEBSOCKET_PORT: z.string(),
    MONGO_URI: z.string(),
    BASE_URL: z.string().url(),
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
    AWS_BUCKET_NAME: z.string(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_REGION: z.string(),
    AWS_SES_AUTO_FROM_EMAIL: z.string(),
    AWS_SES_PERSONAL_FROM_EMAIL: z.string(),
    WHITELIST_ORIGINS: z.string(),
    CLIENT_URL: z.string().url(),
    GOOGLE_OAUTH_CLIENT_ID: z.string(),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
    GOOGLE_GEMINI_API_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
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
});

ZodEnvironmentVariables.parse(process.env);

console.log("✅ Environment variables verified!");
