"use client";

import type { AppRouter } from "@publish-studio/core";
import { constants } from "@publish-studio/core/src/config/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createWSClient,
  getFetch,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import { getCookie } from "cookies-next";
import superjson from "superjson";

import { trpc } from "../../utils/trpc";

if (
  !process.env.NEXT_PUBLIC_TRPC_API_URL ||
  !process.env.NEXT_PUBLIC_WEBSOCKET_URL
) {
  throw new Error(
    "One of NEXT_PUBLIC_TRPC_API_URL or NEXT_PUBLIC_WEBSOCKET_URL is not set",
  );
}

const wsClient = createWSClient({
  url: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: constants.GLOBAL_STALE_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

const token = getCookie("ps_access_token");

const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: () => process.env.NODE_ENV === "development",
    }),
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink<AppRouter>({ client: wsClient }),
      false: httpBatchLink({
        url: process.env.NEXT_PUBLIC_TRPC_API_URL,
        headers() {
          if (!token) {
            return {};
          }

          return {
            Authorization: `Bearer ${token}`,
          };
        },
        fetch: async (input, init?) => {
          const fetch = getFetch();
          return fetch(input, {
            ...init,
            credentials:
              process.env.NODE_ENV === "production" ? "include" : "omit",
          });
        },
      }),
    }),
  ],
});

export function TRPCProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (
    !process.env.NEXT_PUBLIC_TRPC_API_URL ||
    !process.env.NEXT_PUBLIC_WEBSOCKET_URL
  ) {
    throw new Error(
      "One of NEXT_PUBLIC_TRPC_API_URL or NEXT_PUBLIC_WEBSOCKET_URL is not set",
    );
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools position="bottom-left" />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
