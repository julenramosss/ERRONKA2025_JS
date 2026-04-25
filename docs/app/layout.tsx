import type { ReactNode } from "react";

// Root layout — locale-specific layout lives in app/[lang]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
