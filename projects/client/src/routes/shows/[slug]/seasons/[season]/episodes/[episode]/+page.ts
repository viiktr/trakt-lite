import { episodeSummaryQuery } from '$lib/requests/queries/episode/episodeSummaryQuery';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const { queryClient, isBot } = await parent();

  if (isBot) {
    await queryClient.prefetchQuery(
      episodeSummaryQuery({
        slug: params.slug!,
        episode: parseInt(params.episode!),
        season: parseInt(params.season!),
        fetch,
      }),
    );
  }
};
