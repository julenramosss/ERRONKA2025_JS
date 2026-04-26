import { en, type DocsDictionary } from "./en";
import { es } from "./es";
import { eus } from "./eus";

export type SupportedLocale = "en" | "es" | "eus";

const dictionaries: Record<SupportedLocale, DocsDictionary> = {
  en,
  es,
  eus,
};

export function getDictionary(locale: SupportedLocale = "en"): DocsDictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
