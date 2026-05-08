import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { SITE_URL, LOCALES, DEFAULT_LOCALE, buildAlternates } from './lib/seo';

/**
 * Recursively walk a directory and collect URL paths for every .mdx file.
 *
 * Rules:
 *  - Files/directories starting with `_` or `.` are skipped (meta files, hidden dirs).
 *  - `index.mdx` inside a directory maps to the directory path (no trailing `/index`).
 *  - A top-level `index.mdx` maps to `''` (the locale root).
 *
 * @example
 *   content/en/backend/index.mdx → '/backend'
 *   content/en/api/reference.mdx → '/api/reference'
 *   content/en/index.mdx         → ''
 */
function collectMdxPaths(dir: string, prefix = ''): string[] {
  const results: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name;

    // Skip Nextra meta files and hidden entries
    if (name.startsWith('_') || name.startsWith('.')) continue;

    const fullPath = path.join(dir, name);

    if (entry.isDirectory()) {
      results.push(...collectMdxPaths(fullPath, `${prefix}/${name}`));
    } else if (name.endsWith('.mdx')) {
      const slug = name.replace(/\.mdx$/, '');
      // index.mdx → the parent directory path
      const urlPath = slug === 'index' ? prefix : `${prefix}/${slug}`;
      results.push(urlPath);
    }
  }

  return results;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentDir = path.join(process.cwd(), 'content');
  const defaultLocaleDir = path.join(contentDir, DEFAULT_LOCALE);

  // Derive page paths from the default locale — structure is identical across locales
  const pagePaths = collectMdxPaths(defaultLocaleDir);

  const entries: MetadataRoute.Sitemap = [];

  for (const pagePath of pagePaths) {
    // The canonical URL always points to the default locale
    const canonicalUrl = `${SITE_URL}/${DEFAULT_LOCALE}${pagePath}`;

    entries.push({
      url: canonicalUrl,
      lastModified: new Date(),
      changeFrequency: pagePath === '' ? 'daily' : 'weekly',
      // Root page gets highest priority; all other pages 0.8
      priority: pagePath === '' ? 1.0 : 0.8,
      alternates: {
        languages: buildAlternates(pagePath),
      },
    });
  }

  // Also add locale root pages (e.g. /es, /eus) for discoverability
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue; // already added above
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  return entries;
}
