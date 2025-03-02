import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { PaginatableStore } from '$lib/sections/lists/drilldown/PaginatableStore.ts';
import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { useStableArray } from './useStableArray.ts';

export type StablePaginatedStoreProps<T, M> = {
  useList: PaginatableStore<T, M>;
  compareFn: (left: T, right: T) => boolean;
  type: M;
  page: number;
  limit: number;
};
export function useStablePaginated<T, M = MediaType>(
  { useList, compareFn, ...params }: StablePaginatedStoreProps<T, M>,
) {
  const { list: unstable, isLoading, page, updatedAt } = useList(params);

  const { list, set } = useStableArray<T>(compareFn);

  onMount(() => {
    const mountedAt = Date.now();

    unstable.subscribe((items) => {
      const dataAt = get(updatedAt);
      const isCachedData = get(updatedAt) < mountedAt;
      const isWithinRefreshWindow = !isCachedData &&
        dataAt < mountedAt + time.seconds(2.5);

      if (isWithinRefreshWindow) {
        list.set([]);
      }

      set(items);
    });
  });

  return {
    list,
    isLoading,
    page,
  };
}
