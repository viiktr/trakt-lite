import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent, params, fetch }) => {
  const { queryClient, isBot } = await parent();

  if (isBot) {
    await queryClient.prefetchQuery(
      movieSummaryQuery({ slug: params.slug!, fetch }),
    );
  }
};
