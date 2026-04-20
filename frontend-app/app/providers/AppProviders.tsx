"use client";

import type { ReactNode } from "react";
import { ReactQueryProvider } from "./ReactQueryProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({
  children,
}: AppProvidersProps): React.JSX.Element {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
