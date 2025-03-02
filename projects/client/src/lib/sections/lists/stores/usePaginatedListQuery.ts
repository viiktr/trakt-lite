import { useQuery } from '$lib/features/query/useQuery.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export function usePaginatedListQuery<
  TOutput,
  TError extends Error,
>(
  props: CreateQueryOptions<Paginatable<TOutput>, TError>,
) {
  const query = useQuery(props);

  const isLoading = derived(query, toLoadingState);
  const updatedAt = derived(query, ($query) => $query.dataUpdatedAt);

  const list = derived(query, ($query) => $query.data?.entries ?? []);

  const page = derived(
    query,
    ($query) => $query.data?.page ?? { page: 0, total: 0 },
  );

  return { list, page, isLoading, updatedAt };
}
