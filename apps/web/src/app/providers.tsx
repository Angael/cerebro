'use client';

import { showErrorNotification } from '@/utils/notificationHelpers';
import { MutationCache, QueryClient, QueryClientProvider, QueryKey } from '@tanstack/react-query';
import * as React from 'react';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: {
      status: number;
    };

    mutationMeta: {
      invalidate?: Parameters<QueryClient['invalidateQueries']>[0];
      invalidateQueryKey?: QueryKey;
      successMessage?: string; // unused
      error?: {
        title: string;
        message: string;
      };
    };
  }
}

export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 5 * 1000,
          },
        },
        mutationCache: new MutationCache({
          onError: (error, variables, context, mutation) => {
            if (error?.status === 401) {
              // perform logout
              window.location.href = '/signin'; // or navigate with router
            }

            if (mutation.meta?.error) {
              const { title, message } = mutation.meta.error;

              showErrorNotification(title, message);
            }
          },
          onSettled: (data, error, variables, context, mutation) => {
            if (mutation.meta?.invalidateQueryKey) {
              queryClient.invalidateQueries({
                queryKey: mutation.meta.invalidateQueryKey,
              });
            }
            if (mutation.meta?.invalidate) {
              queryClient.invalidateQueries(mutation.meta.invalidate);
            }
          },
        }),
      }),
  );

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
