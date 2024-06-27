"use client";

import { constants } from "@publish-studio/core/src/config/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import { getCookie } from "cookies-next";
import Pusher from "pusher-js";
import superjson from "superjson";

import { createTRPCServerClient } from "@/utils/trpc";

import { trpc } from "../../utils/trpc";

if (!process.env.NEXT_PUBLIC_TRPC_API_URL) {
  throw new Error("NEXT_PUBLIC_TRPC_API_URL is not set");
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: constants.GLOBAL_STALE_TIME,
      cacheTime: constants.GLOBAL_CACHE_TIME,
      refetchOnWindowFocus: false,
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
    httpBatchLink({
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
  ],
});

if (
  !process.env.NEXT_PUBLIC_PUSHER_KEY ||
  !process.env.NEXT_PUBLIC_PUSHER_CLUSTER
) {
  throw new Error(
    "One of NEXT_PUBLIC_PUSHER_KEY or NEXT_PUBLIC_PUSHER_CLUSTER is not set.",
  );
}

export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  userAuthentication: {
    async customHandler({ socketId }, callback) {
      const client = createTRPCServerClient({
        Authorization: `Bearer ${token}`,
      });

      const data = await client.auth.pusherAuth.mutate({
        socket_id: socketId,
      });

      callback(null, data);
    },
  },
});

if (token) {
  pusher.signin();
}

export function TRPCProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools position="bottom-left" />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
