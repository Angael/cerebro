import { MutationCache, QueryClient, QueryKey } from '@tanstack/react-query';
import { showErrorNotification } from './notificationHelpers';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: {
      status: number;
    };

    mutationMeta: {
      invalidateQueryKey?: QueryKey;
      successMessage?: string; // unused
      error?: {
        title: string;
        message: string;
      };
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 1000,
    },
  },
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      console.log('mutation cache onError', error);
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
    },
  }),
});
