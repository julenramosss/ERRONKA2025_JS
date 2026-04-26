import type { ReactNode } from "react";
import "./globals.css";

// Root layout — locale-specific layout lives in app/[lang]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body className="w-screen h-screen bg-bg-dark text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
