import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "./providers/AppProviders";
import "./globals.css";
import { RouteGuard } from "./components/RouteGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "pakAG",
  description: "pakAG delivery tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="w-screen min-h-screen overflow-x-hidden">
        <AppProviders>
          <RouteGuard>{children}</RouteGuard>
        </AppProviders>
      </body>
    </html>
  );
}
