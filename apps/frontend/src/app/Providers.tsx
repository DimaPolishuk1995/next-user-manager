"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (e) => console.error("Query error:", e),
                }),
                mutationCache: new MutationCache({
                    onError: (e) => console.error("Mutation error:", e),
                }),
                defaultOptions: {
                    queries: { retry: 1, refetchOnWindowFocus: false },
                },
            }),
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
