import { browser } from '$app/environment';
import {
  searchQuery,
  searchQueryKey,
  type SearchResult,
} from '$lib/requests/queries/search/searchQuery.ts';
import { CancelledError, useQueryClient } from '@tanstack/svelte-query';
import { writable } from 'svelte/store';

export function useSearch() {
  const results = writable([] as SearchResult[]);
  const client = browser ? useQueryClient() : undefined;

  async function search(query: string) {
    if (!client) {
      return;
    }

    if (!query.trim()) {
      results.set([]);
      return;
    }

    const response = await client.fetchQuery(searchQuery({
      query,
    })).catch((error) => {
      if (error instanceof CancelledError) {
        return new Promise<SearchResult[]>((resolve) => resolve([]));
      }

      return Promise.reject(error);
    });

    results.set(response.filter((result) => result.year != null));
  }

  function clear() {
    client?.cancelQueries({
      predicate: (query) => query.queryKey.at(0) === searchQueryKey('').at(0),
    });
    results.set([]);
  }

  return {
    search,
    clear,
    results,
  };
}
