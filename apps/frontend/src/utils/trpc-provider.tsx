"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";

import { useState } from "react";
import { trpc } from "./trpc";

export function TRPCProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [queryClient] = useState(
        () => new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }),
    );

    let token: string | null = null;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("ps_access_token");
    }

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                loggerLink({
                    enabled: () => true,
                }),
                httpBatchLink({
                    url: process.env.NEXT_PUBLIC_TRPC_API_URL as string,
                    async headers() {
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
            ],
        }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools />
            </QueryClientProvider>
        </trpc.Provider>
    );
}
