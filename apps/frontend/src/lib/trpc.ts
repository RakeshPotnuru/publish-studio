import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@publish-studio/core/src";

const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: process.env.NEXT_PUBLIC_TRPC_API_URL as string,
        }),
    ],
});

export default trpc;
