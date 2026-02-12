import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always consider data stale, refetch on every request
      gcTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 2,
    },
    mutations: {
      // Mutations queue when offline, flush when connectivity returns
      networkMode: "offlineFirst",
      retry: 3,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  throttleTime: 1000,
});

export default function StateProvider({ children }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const persistKeys = ["ingredients", "recipes"];
            return persistKeys.some((key) => query.queryKey.includes(key));
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
