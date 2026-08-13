// src/components/common/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep the small mess dataset in cache while navigating between
            // dashboard pages; this avoids repeating the same requests.
            staleTime: 5 * 60 * 1000,
            gcTime: 15 * 60 * 1000,
            retry: 1,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
