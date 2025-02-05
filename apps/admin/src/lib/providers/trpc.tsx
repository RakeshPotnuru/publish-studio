"use client";

import { constants } from "@publish-studio/core/src/config/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

import { trpc } from "../../utils/trpc";

export function TRPCProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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

  if (!process.env.NEXT_PUBLIC_TRPC_API_URL) {
    throw new Error("NEXT_PUBLIC_TRPC_API_URL is not set");
  }

  const trpcClient = trpc.createClient({
    transformer: superjson,
    links: [
      loggerLink({
        enabled: () => process.env.NODE_ENV === "development",
      }),
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_TRPC_API_URL,
        fetch: async (input, init?) => {
          const fetch = getFetch();
          return fetch(input, {
            ...init,
            credentials: "include",
          });
        },
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
