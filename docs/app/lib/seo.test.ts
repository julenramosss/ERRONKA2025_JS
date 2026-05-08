import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// We need to isolate module state between tests because SITE_URL is resolved
// at module load time from process.env. Using vi.resetModules() + dynamic
// import gives us a clean slate per test group.
// ---------------------------------------------------------------------------

describe('seo constants', () => {
  it('exports the three supported locales', async () => {
    const { LOCALES } = await import('./seo');
    expect(LOCALES).toEqual(['en', 'es', 'eus']);
  });

  it('DEFAULT_LOCALE is "en"', async () => {
    const { DEFAULT_LOCALE } = await import('./seo');
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('SITE_URL falls back to docs.tolosaerronka.es when env is not set', async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_DOCS_URL;
    const { SITE_URL } = await import('./seo');
    expect(SITE_URL).toBe('https://docs.tolosaerronka.es');
  });

  it('SITE_URL uses NEXT_PUBLIC_DOCS_URL when set', async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_DOCS_URL = 'https://preview.example.com/';
    const { SITE_URL } = await import('./seo');
    // trailing slash must be stripped
    expect(SITE_URL).toBe('https://preview.example.com');
  });

  afterEach(() => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_DOCS_URL;
  });
});

// ---------------------------------------------------------------------------
// buildCanonical
// ---------------------------------------------------------------------------

describe('buildCanonical', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_DOCS_URL;
  });
  afterEach(() => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_DOCS_URL;
  });

  it('builds canonical for a nested page', async () => {
    const { buildCanonical } = await import('./seo');
    expect(buildCanonical('en', '/backend')).toBe(
      'https://docs.tolosaerronka.es/en/backend',
    );
  });

  it('builds canonical for the locale root (empty pagePath)', async () => {
    const { buildCanonical } = await import('./seo');
    expect(buildCanonical('es', '')).toBe('https://docs.tolosaerronka.es/es');
  });

  it('builds canonical for a deeply nested page', async () => {
    const { buildCanonical } = await import('./seo');
    expect(buildCanonical('eus', '/api/reference')).toBe(
      'https://docs.tolosaerronka.es/eus/api/reference',
    );
  });

  it('respects a custom SITE_URL from env', async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_DOCS_URL = 'https://staging.docs.example.com';
    const { buildCanonical } = await import('./seo');
    expect(buildCanonical('en', '/setup')).toBe(
      'https://staging.docs.example.com/en/setup',
    );
  });
});

// ---------------------------------------------------------------------------
// buildAlternates
// ---------------------------------------------------------------------------

describe('buildAlternates', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_DOCS_URL;
  });
  afterEach(() => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_DOCS_URL;
  });

  it('returns an entry for every supported locale', async () => {
    const { buildAlternates, LOCALES } = await import('./seo');
    const result = buildAlternates('/backend');
    for (const locale of LOCALES) {
      expect(result).toHaveProperty(locale);
    }
  });

  it('includes x-default pointing to the default locale', async () => {
    const { buildAlternates } = await import('./seo');
    const result = buildAlternates('/backend');
    expect(result['x-default']).toBe(
      'https://docs.tolosaerronka.es/en/backend',
    );
  });

  it('each locale URL is correct', async () => {
    const { buildAlternates } = await import('./seo');
    const result = buildAlternates('/architecture');
    expect(result['en']).toBe('https://docs.tolosaerronka.es/en/architecture');
    expect(result['es']).toBe('https://docs.tolosaerronka.es/es/architecture');
    expect(result['eus']).toBe(
      'https://docs.tolosaerronka.es/eus/architecture',
    );
  });

  it('handles the locale root (empty pagePath)', async () => {
    const { buildAlternates } = await import('./seo');
    const result = buildAlternates('');
    expect(result['en']).toBe('https://docs.tolosaerronka.es/en');
    expect(result['x-default']).toBe('https://docs.tolosaerronka.es/en');
  });

  it('total keys = locales count + x-default', async () => {
    const { buildAlternates, LOCALES } = await import('./seo');
    const result = buildAlternates('/setup');
    expect(Object.keys(result)).toHaveLength(LOCALES.length + 1);
  });
});
