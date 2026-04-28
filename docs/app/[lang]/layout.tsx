import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../globals.css';
import { getDictionary } from '../i18n';
import type { SupportedLocale } from '../i18n';
import { PakLogo } from '../components/PakLogo';
import { DocsSidebarNav } from '../components/DocsSidebarNav';
import { LocaleSwitcher } from '../components/LocaleSwitcher';
import { MobileMenu } from '../components/MobileMenu';
import { MobileSearchButton } from '../components/MobileSearchButton';
import { PageToc } from '../components/PageToc';
import { MobilePageTools } from '../components/MobilePageTools';
import { DocsSearch } from '../components/DocsSearch';
import { HTMLaddElements } from '../components/HTMLaddElements';
import { buildSearchIndex } from '../lib/search-index';
import { navItems } from '../utils/constants';
import { DocsDictionary } from '../i18n/en';

export const metadata: Metadata = {
  title: {
    template: '%s · PakAG Docs',
    default: 'PakAG Engineering Docs',
  },
  description:
    'Technical documentation for PakAG backend, frontend, operations, and onboarding.',
};

type LayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ lang: string }>;
}>;

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale = (lang as SupportedLocale) ?? 'en';
  const dict = getDictionary(locale);
  const nav = navItems(dict.navigation);
  const searchEntries = buildSearchIndex(locale);

  return (
    <>
      <HTMLaddElements lang={locale} />
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col h-screen sticky top-0 bg-bg-surface border-r border-border overflow-y-auto">
          <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
            <PakLogo size={26} showText />
          </div>
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <DocsSidebarNav locale={locale} navItems={nav} />
          </nav>
          <div className="shrink-0 px-4 py-4 border-t border-border">
            <LocaleSwitcher currentLocale={locale} />
          </div>
        </aside>

        {/* Main content area */}
        <div
          id="docs-scroll"
          className="flex flex-1 flex-col min-h-screen overflow-y-auto overflow-x-hidden"
        >
          {/* Header */}
          <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-6 bg-bg-elevated border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <MobileMenu locale={locale} navItems={nav} />
              <div className="flex md:hidden">
                <PakLogo size={24} showText />
              </div>
            </div>
            {/* Desktop: search + locale */}
            <div className="hidden md:flex items-center gap-3">
              <DocsSearch
                entries={searchEntries}
                placeholder={`${dict.common.search}...`}
              />
              <LocaleSwitcher currentLocale={locale} />
            </div>
            {/* Mobile: search icon + locale */}
            <div className="flex md:hidden items-center gap-2">
              <DocsSearch
                entries={searchEntries}
                placeholder={`${dict.common.search}...`}
                hideTrigger
              />
              <MobileSearchButton />
              <LocaleSwitcher currentLocale={locale} />
            </div>
          </header>

          {/* Mobile toolbar: TOC + search button */}
          <div className="docs-mobile-toolbar">
            <MobilePageTools tocLabel={dict.common.onThisPage} />
          </div>

          {/* Page content */}
          <main
            className="flex-1 px-4 py-6 md:px-8 lg:px-12 w-full"
            style={{ viewTransitionName: 'page-content' }}
          >
            <div className="docs-layout">
              <div className="docs-content">{children}</div>
              {/* Right TOC: xl+ only */}
              <aside className="docs-toc-aside">
                <div className="docs-toc-sticky">
                  <PageToc label={dict.common.onThisPage} />
                </div>
              </aside>
            </div>
          </main>

          {/* Footer */}
          <footer className="shrink-0 px-6 py-5 md:px-10 border-t border-border text-text-disabled text-sm">
            pakAG © {new Date().getFullYear()} · Internal engineering handbook
          </footer>
        </div>
      </div>
    </>
  );
}
