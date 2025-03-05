import { useWellKnownErrors } from '$lib/features/errors/useWellKnownErrors.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { derived, get } from 'svelte/store';
import { currentUserHistoryQuery } from '../queries/currentUserHistoryQuery.ts';
import { currentUserRatingsQuery } from '../queries/currentUserRatingsQuery.ts';
import { currentUserSettingsQuery } from '../queries/currentUserSettingsQuery.ts';
import { currentUserWatchlistQuery } from '../queries/currentUserWatchlistQuery.ts';

export function useUser() {
  const { error503 } = useWellKnownErrors();
  const userQueryResponse = useQuery(currentUserSettingsQuery());
  const historyQueryResponse = useQuery(currentUserHistoryQuery());
  const watchlistQueryResponse = useQuery(currentUserWatchlistQuery());
  const ratingsQueryResponse = useQuery(currentUserRatingsQuery());

  const user = derived(userQueryResponse, ($query) => {
    if ($query.error) {
      // TODO: only for 503, move to currentUserSettingsQuery?
      error503.set(true);
    }

    return $query.data;
  });

  const history = derived(historyQueryResponse, ($query) => $query.data);
  const watchlist = derived(
    watchlistQueryResponse,
    ($watchlist) => $watchlist.data,
  );
  const ratings = derived(ratingsQueryResponse, ($ratings) => $ratings.data);

  return {
    user,
    history,
    watchlist,
    ratings,
    current: () =>
      assertDefined(
        get(user),
        'This hook must be used within a RenderFor guard, target audience = authenticated!',
      ),
  };
}
