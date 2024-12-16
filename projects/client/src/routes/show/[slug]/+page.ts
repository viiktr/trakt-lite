import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent, params, fetch }) => {
  const { queryClient } = await parent();

  await queryClient.prefetchQuery(
    showSummaryQuery({ slug: params.slug!, fetch }),
  );
};
