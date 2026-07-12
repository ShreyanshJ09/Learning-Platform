import type { ReactNode } from "react";

import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Composes app-wide providers in a single place.
 * AuthProvider is added in Phase 2.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
