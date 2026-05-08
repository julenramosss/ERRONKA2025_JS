import { en, type DocsDictionary } from './en';
import { es } from './es';
import { eus } from './eus';

/** Single source of truth for supported locales across i18n AND SEO. */
export const LOCALES = ['en', 'es', 'eus'] as const;
export type SupportedLocale = (typeof LOCALES)[number];

const dictionaries: Record<SupportedLocale, DocsDictionary> = {
  en,
  es,
  eus,
};

export function getDictionary(locale: SupportedLocale = 'en'): DocsDictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
