import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const { queryClient, isBot } = await parent();

  if (isBot) {
    await queryClient.prefetchQuery(
      movieSummaryQuery({ slug: params.slug!, fetch }),
    );
  }
};
