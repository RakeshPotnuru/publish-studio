"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import { useCookies } from "react-cookie";
import superjson from "superjson";

import { trpc } from "../../utils/trpc";

export function TRPCProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [cookies, _] = useCookies(["ps_access_token"]);

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

    const token = cookies.ps_access_token;

    const trpcClient = trpc.createClient({
        transformer: superjson,
        links: [
            loggerLink({
                enabled: () => true,
            }),
            httpBatchLink({
                url: process.env.NEXT_PUBLIC_TRPC_API_URL as string,
                async headers() {
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
        ],
    });

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools position="bottom-right" />
            </QueryClientProvider>
        </trpc.Provider>
    );
}
