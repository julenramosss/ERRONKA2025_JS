'use client';

import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { isAppError } from '../lib/api/helpers/errors';

const NON_RETRIABLE_STATUSES = new Set([400, 401, 403, 404, 409]);

function createQueryClientConfig(): QueryClientConfig {
  return {
    defaultOptions: {
      queries: {
        retry: (failureCount, error: unknown) => {
          if (failureCount >= 1) {
            return false;
          }

          if (
            isAppError(error) &&
            error.status !== undefined &&
            NON_RETRIABLE_STATUSES.has(error.status)
          ) {
            return false;
          }

          return true;
        },
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        gcTime: 10 * 60 * 1000, // keep cache 10 min after component unmounts
      },
      mutations: {
        retry: false,
      },
    },
  };
}

function createQueryClient(): QueryClient {
  return new QueryClient(createQueryClientConfig());
}

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({
  children,
}: ReactQueryProviderProps): React.JSX.Element {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
