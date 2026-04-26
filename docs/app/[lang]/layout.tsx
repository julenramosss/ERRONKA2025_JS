import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { getDictionary } from "../i18n";
import type { SupportedLocale } from "../i18n";
import { PakLogo } from "../components/PakLogo";
import { DocsSidebarNav } from "../components/DocsSidebarNav";
import { LocaleSwitcher } from "../components/LocaleSwitcher";
import { MobileMenu } from "../components/MobileMenu";

export const metadata: Metadata = {
  title: {
    template: "%s · PakAG Docs",
    default: "PakAG Engineering Docs",
  },
  description:
    "Technical documentation for PakAG backend, frontend, operations, and onboarding.",
};

type LayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ lang: string }>;
}>;

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale = (lang as SupportedLocale) ?? "en";
  const dict = getDictionary(locale);
  const nav = dict.navigation;

  const navItems = [
    { href: "/", label: nav.home },
    { href: "/project", label: nav.projectOverview },
    { href: "/monorepo", label: nav.monorepo },
    { href: "/setup", label: nav.setup },
    { href: "/environment", label: nav.environment },
    { href: "/backend", label: nav.backend },
    { href: "/frontend", label: nav.frontend },
    { href: "/architecture", label: nav.architecture },
    { href: "/api", label: nav.apiReference },
    { href: "/security", label: nav.authSecurity },
    { href: "/domain", label: nav.domainModel },
    { href: "/database", label: nav.database },
    { href: "/deployment", label: nav.deployment },
    { href: "/troubleshooting", label: nav.troubleshooting },
    { href: "/contributing", label: nav.contributing },
    { href: "/ai-workflow", label: nav.aiWorkflow },
  ];

  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#7c3aed" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-dark text-text-primary font-sans antialiased">
        <div className="flex h-screen overflow-hidden">
          {/* ── Desktop Sidebar ───────────────────────────────────────── */}
          <aside className="hidden md:flex w-64 shrink-0 flex-col h-screen sticky top-0 bg-bg-surface border-r border-border overflow-y-auto">
            {/* Sidebar header */}
            <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
              <PakLogo size={26} showText />
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
              <DocsSidebarNav locale={locale} navItems={navItems} />
            </nav>

            {/* Sidebar footer - locale switcher */}
            <div className="shrink-0 px-4 py-4 border-t border-border">
              <LocaleSwitcher currentLocale={locale} />
            </div>
          </aside>

          {/* ── Main content area ─────────────────────────────────────── */}
          <div className="flex flex-1 flex-col min-h-screen overflow-auto">
            {/* Top header */}
            <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-bg-elevated border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <MobileMenu locale={locale} navItems={navItems} />
                {/* Logo (mobile only) */}
                <div className="flex md:hidden">
                  <PakLogo size={24} showText />
                </div>
              </div>
              {/* Right side: locale switcher on desktop */}
              <div className="hidden md:flex items-center gap-3">
                <LocaleSwitcher currentLocale={locale} />
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 px-6 py-8 md:px-10 lg:px-16 max-w-5xl w-full">
              <div className="docs-content">{children}</div>
            </main>

            {/* Footer */}
            <footer className="shrink-0 px-6 py-5 md:px-10 border-t border-border text-text-disabled text-sm">
              pakAG © {new Date().getFullYear()} · Internal engineering handbook
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
