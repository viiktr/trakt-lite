import { useQuery } from '$lib/features/query/useQuery.ts';
import { listItemsQuery } from '$lib/requests/queries/lists/listItemsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

export function useList(id: number) {
  const items = useQuery(listItemsQuery({
    id,
  }));

  const isLoading = derived(
    items,
    toLoadingState,
  );

  return {
    isLoading,
    items: derived(items, ($list) => $list.data),
  };
}
