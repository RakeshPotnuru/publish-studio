import { z } from "zod";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface ProcessEnv extends z.infer<typeof ZodEnvironmentVariables> {}
    }
}

const ZodEnvironmentVariables = z.object({
    NODE_ENV: z.string(),
    PORT: z.string(),
    MONGO_URI: z.string(),
    BASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    ACCESS_TOKEN_PRIVATE_KEY: z.string(),
    ACCESS_TOKEN_PUBLIC_KEY: z.string(),
    REFRESH_TOKEN_PRIVATE_KEY: z.string(),
    REFRESH_TOKEN_PUBLIC_KEY: z.string(),
    AWS_BUCKET_NAME: z.string(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_REGION: z.string(),
    KICKBOX_URL: z.string().url(),
    ORIGIN_URL: z.string().url(),
    HAHSNODE_API_URL: z.string().url(),
    DEVTO_API_URL: z.string().url(),
    MEDIUM_API_URL: z.string().url(),
});

ZodEnvironmentVariables.parse(process.env);

console.log("✅ Environment variables verified!");
