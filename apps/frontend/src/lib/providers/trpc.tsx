"use client";

import type { AppRouter } from "@publish-studio/core";
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

export function TRPCProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
    },
  });

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

  const token = getCookie("ps_access_token");

  const trpcClient = trpc.createClient({
    transformer: superjson,
    links: [
      loggerLink({
        enabled: () => true,
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
                process.env.NEXT_PUBLIC_TRPC_API_URL === "production"
                  ? "include"
                  : "omit",
            });
          },
        }),
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools position="bottom-left" />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
