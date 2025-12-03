import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/feedback/ErrorFallback";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { store, persistor } from "@/store/store";
import { queryClient } from "@/lib";
import SocketInitializer from "./SocketInitializer";

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <SocketInitializer />
      <ReduxProvider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PersistGate>
      </ReduxProvider>
    </ErrorBoundary>
  );
};

export default Providers;
