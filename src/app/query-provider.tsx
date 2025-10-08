'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

const DEFAULT_RETRY_DELAY = (attempt: number) => Math.min(1500 * (attempt + 1), 4000);

export const QueryProvider = ({ children }: { children: ReactNode }) => {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 2,
                        retryDelay: DEFAULT_RETRY_DELAY,
                        refetchOnWindowFocus: false,
                        staleTime: 24 * 60 * 60 * 1000, // 1 day
                        gcTime: 24 * 60 * 60 * 1000, // 1 day
                    },
                    mutations: {
                        retry: 2,
                        retryDelay: DEFAULT_RETRY_DELAY,
                    },
                },
            }),
    );

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
