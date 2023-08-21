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
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string(),
    RABBITMQ_URL: z.string(),
});

ZodEnvironmentVariables.parse(process.env);

console.log("✅ Environment variables verified!");
