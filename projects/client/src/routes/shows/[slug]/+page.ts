import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const { queryClient, isBot } = await parent();

  if (isBot) {
    await queryClient.prefetchQuery(
      showSummaryQuery({ slug: params.slug!, fetch }),
    );
  }
};
