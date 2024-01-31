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
import { useCookies } from "react-cookie";
import superjson from "superjson";

import { trpc } from "../../utils/trpc";

const wsClient = createWSClient({
    url: "ws://localhost:4001/",
});

export function TRPCProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [cookies] = useCookies(["ps_access_token"]);

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

    if (!process.env.NEXT_PUBLIC_TRPC_API_URL) {
        throw new Error("NEXT_PUBLIC_TRPC_API_URL is not set");
    }

    const token = cookies.ps_access_token;

    const trpcClient = trpc.createClient({
        transformer: superjson,
        links: [
            loggerLink({
                enabled: () => true,
            }),
            splitLink({
                condition: op => op.type === "subscription",
                true: wsLink<AppRouter>({ client: wsClient }),
                false: httpBatchLink({
                    url: process.env.NEXT_PUBLIC_TRPC_API_URL,
                    headers() {
                        if (!token) {
                            return {};
                        }

                        return {
                            Authorization: `Bearer ${token as string}`,
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
