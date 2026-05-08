import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { SITE_URL } from './lib/seo';

/**
 * metadataBase is REQUIRED here so that every openGraph.url, twitter.images,
 * and alternates.canonical resolved by child layouts/pages becomes an absolute URL.
 * Without it Next.js emits relative paths that OG scrapers and search engines reject.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

// Root layout — locale-specific layout lives in app/[lang]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body className="w-full max-w-[100vw] overflow-x-hidden h-screen bg-bg-dark text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
