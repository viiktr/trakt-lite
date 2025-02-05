import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapListResponseToMediaListSummary } from '../../_internal/mapListResponseToMediaListSummary.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type MovieListsParams = { slug: string } & ApiParams;

const movieListsRequest = (
  { fetch, slug }: MovieListsParams,
) =>
  api({ fetch })
    .movies
    .lists({
      params: {
        id: slug,
        type: 'all',
        sort: 'popular',
      },
      query: {
        extended: 'images',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch movie lists');
      }

      return response.body;
    });

//TODO tests

export const movieListsQuery = defineQuery({
  key: 'movieLists',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieListsRequest,
  mapper: (data) => data.map(mapListResponseToMediaListSummary),
  schema: MediaListSummarySchema.array(),
  ttl: time.minutes(30),
});
