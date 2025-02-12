import { browser } from '$app/environment';
import { invalidationPredicate } from '$lib/features/query/_internal/invalidationPredicate.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  createQuery,
  type CreateQueryOptions,
  useQueryClient,
} from '@tanstack/svelte-query';
import { onMount } from 'svelte';
import { findInvalidationId } from './_internal/findInvalidationId.ts';
import { findQueryId } from './_internal/findQueryId.ts';

const INVALIDATION_MAP = new Map<string, number>();

export function useQuery<
  TOutput,
  TError extends Error,
>(
  props: CreateQueryOptions<TOutput, TError>,
) {
  const client = browser ? useQueryClient() : undefined;

  onMount(() => {
    if (client == null) {
      return;
    }

    const id = findQueryId(props.queryKey);

    if (id == null) {
      return;
    }

    const hasInvalidationMarker = findInvalidationId(props.queryKey) != null;

    if (!hasInvalidationMarker) {
      return;
    }

    const isInvalidatedQueued = INVALIDATION_MAP.has(id);

    if (isInvalidatedQueued) {
      return;
    }

    INVALIDATION_MAP.set(id, Date.now());

    const timeoutId = setTimeout(() => {
      client.invalidateQueries({
        predicate: (query) => invalidationPredicate(query.queryKey, id),
      });
    }, time.seconds(1));

    return () => {
      clearTimeout(timeoutId);
    };
  });

  return createQuery(props);
}
