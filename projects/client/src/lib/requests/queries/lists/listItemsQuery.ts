import type {
  WatchlistedMoviesResponse,
  WatchlistedShowsResponse,
} from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from '../../../../../../api/src/contracts/_internal/z.ts';

type ListItemsParams = { id: number } & ApiParams;

export const ListItemsSchema = ListItemSchemaFactory(
  z.union([MovieEntrySchema, ShowEntrySchema]),
);

const listItemsRequest = (
  { fetch, id }: ListItemsParams,
) =>
  api({ fetch })
    .lists
    .items({
      params: {
        id: `${id}`,
      },
      query: {
        extended: 'full,images',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch list items');
      }

      return response.body;
    });

//TODO tests

// TODO create own schema
const mapResponseToListItems = (
  watchListItem: WatchlistedMoviesResponse | WatchlistedShowsResponse,
) => ({
  id: watchListItem.id,
  rank: watchListItem.rank,
  notes: watchListItem.notes,
  type: watchListItem.type === 'movie' ? 'movie' as const : 'show' as const,
  listedAt: new Date(watchListItem.listed_at),
  entry: 'movie' in watchListItem
    ? mapMovieResponseToMovieSummary(watchListItem.movie)
    : mapShowResponseToShowSummary(watchListItem.show),
});

export const listItemsQuery = defineQuery({
  key: 'listItems',
  invalidations: [],
  dependencies: (params) => [params.id],
  request: listItemsRequest,
  mapper: (data) => data.map(mapResponseToListItems),
  schema: ListItemsSchema.array(),
  ttl: time.minutes(30),
});
