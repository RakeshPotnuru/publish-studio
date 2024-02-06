import type { AppRouter } from "@publish-studio/core";
import type {
  HTTPHeaders} from "@trpc/react-query";
import {
  createTRPCProxyClient,
  createTRPCReact,
  getFetch,
  httpBatchLink,
  loggerLink,
} from "@trpc/react-query";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();
export const createTRPCServerClient = (headers: HTTPHeaders) => {
  if (!process.env.NEXT_PUBLIC_TRPC_API_URL) {
    throw new Error("NEXT_PUBLIC_TRPC_API_URL is not set");
  }

  return createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      loggerLink({
        enabled: () => true,
      }),
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_TRPC_API_URL,
        headers() {
          return headers;
        },
        fetch: async (input, init?) => {
          const fetch = getFetch();
          return fetch(input, {
            ...init,
            credentials:
              process.env.NEXT_PUBLIC_TRPC_API_URL === "production"
                ? "include"
                : "omit",
          });
        },
      }),
    ],
  });
};
