// components/common/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 60 * 1000, // 30 minutes
            gcTime: 60 * 60 * 1000, // 60 minutes
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
            retryDelay: 1000,
            refetchInterval: false,
            refetchIntervalInBackground: false,
            // ✅ Don't refetch on mount
            enabled: true,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
