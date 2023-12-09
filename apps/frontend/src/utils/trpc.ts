import type { AppRouter } from "@publish-studio/core";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
