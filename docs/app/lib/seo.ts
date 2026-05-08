/**
 * SEO configuration — single source of truth for metadata, canonical URLs,
 * and hreflang alternates across the docs site.
 *
 * Locale definitions live in i18n/index.ts and are imported here intentionally:
 * i18n is the owner of "what locales exist", SEO consumes that contract.
 *
 * Override NEXT_PUBLIC_DOCS_URL in .env.local for local / staging previews.
 */
import { LOCALES, type SupportedLocale } from '../i18n';

export { LOCALES, type SupportedLocale };

export const SITE_URL =
  process.env.NEXT_PUBLIC_DOCS_URL?.replace(/\/$/, '') ??
  'https://docs.tolosaerronka.es';

export const SITE_NAME = 'PakAG Docs';

export const DEFAULT_DESCRIPTION =
  'Technical documentation for PakAG — the package distribution and tracking platform. ' +
  'API reference, architecture, setup guides, and operational runbooks.';

export const DEFAULT_LOCALE: SupportedLocale = 'en';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build the canonical URL for a given locale + page path.
 * `pagePath` must start with `/` or be empty string for the locale root.
 *
 * @example buildCanonical('en', '/backend') → 'https://docs.tolosaerronka.es/en/backend'
 * @example buildCanonical('es', '')         → 'https://docs.tolosaerronka.es/es'
 */
export function buildCanonical(lang: string, pagePath: string): string {
  return `${SITE_URL}/${lang}${pagePath}`;
}

/**
 * Build the `alternates.languages` map for hreflang tags.
 * Includes `x-default` pointing to the default locale.
 *
 * @example buildAlternates('/backend') → { en: '…/en/backend', es: '…/es/backend', … }
 */
export function buildAlternates(pagePath: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = `${SITE_URL}/${locale}${pagePath}`;
  }
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${pagePath}`;
  return languages;
}
