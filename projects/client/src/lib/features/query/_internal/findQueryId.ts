import { queryId } from '$lib/features/query/defineQuery.ts';

export function findQueryId(queryKey: readonly unknown[]): string | Nil {
  return queryKey.find((key) =>
    typeof key === 'string' && key.includes(queryId(''))
  ) as string | Nil;
}
