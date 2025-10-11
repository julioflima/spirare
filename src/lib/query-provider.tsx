'use client';

import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
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
                    },
                    mutations: {
                        retry: 2,
                        retryDelay: DEFAULT_RETRY_DELAY,
                    },
                },
            }),
    );

    const [persister] = useState(() =>
        createAsyncStoragePersister({
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        })
    );

    return (
        <PersistQueryClientProvider client={client} persistOptions={{ persister }}>
            {children}
        </PersistQueryClientProvider>
    );
};
