import searchData from "./search-data.json";

export interface SearchEntry {
  title: string;
  path: string;
  content: string;
  excerpt: string;
}

export function buildSearchIndex(lang: string): SearchEntry[] {
  const entries = (searchData as Record<string, SearchEntry[]>)[lang];
  return entries ?? [];
}
