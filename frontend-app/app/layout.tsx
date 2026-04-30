import type { Metadata } from 'next';
import { AppProviders } from './providers/AppProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'pakAG',
  description: 'pakAG delivery tracking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="w-screen min-h-screen overflow-x-hidden">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
