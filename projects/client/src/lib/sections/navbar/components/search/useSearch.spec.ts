import { renderStore } from '$test/beds/store/renderStore';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { useSearch } from './useSearch';

describe('useSearch', () => {
  it('should initialize with empty results', async () => {
    const { results } = await renderStore(() => useSearch());

    expect(get(results)).toEqual([]);
  });

  it('should return empty results when search term is empty', async () => {
    const { search, results } = await renderStore(() => useSearch());

    await search('');
    expect(get(results)).toEqual([]);
  });

  it('should return empty results when search string is full of whitespaces', async () => {
    const { search, results } = await renderStore(() => useSearch());

    await search('      ');
    expect(get(results)).toEqual([]);
  });

  it('should handle successful search', async () => {
    const { search, results } = await renderStore(() => useSearch());
    await search('test query');

    expect(get(results)).toEqual([]);
  });
});
