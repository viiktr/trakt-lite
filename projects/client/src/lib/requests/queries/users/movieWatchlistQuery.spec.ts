import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { WatchlistMoviesMappedMock } from '$mocks/data/users/mapped/WatchlistMoviesMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieWatchlistQuery } from './movieWatchlistQuery.ts';

describe('movieWatchlistQuery', () => {
  it('should query watchlist movies', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          movieWatchlistQuery(),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(WatchlistMoviesMappedMock);
  });

  it('should invalidate on watchlisted movie', async () => {
    const query = movieWatchlistQuery();

    await query.queryKey.includes(InvalidateAction.Watchlisted('movie'));
  });

  it('should invalidate on mark as watched', async () => {
    const query = movieWatchlistQuery();

    await query.queryKey.includes(InvalidateAction.MarkAsWatched('movie'));
  });
});
