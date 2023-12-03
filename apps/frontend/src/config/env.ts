import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_TRPC_API_URL: z.string(),
    NODE_ENV: z.enum(["development", "production", "staging"]),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
