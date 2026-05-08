import { describe, expect, it } from 'vitest';
import { buildSearchIndex } from './search-index';

describe('buildSearchIndex', () => {
  it('includes a derived category from the first path segment after locale', () => {
    const entries = buildSearchIndex('en');

    const apiEntry = entries.find((entry) => entry.path === '/en/api');
    const rootEntry = entries.find((entry) => entry.path === '/en');

    expect(apiEntry?.category).toBe('api');
    expect(rootEntry?.category).toBe('root');
  });
});
