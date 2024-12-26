import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { isAuthorized } from '$lib/features/auth/token/index.ts';
import { derived, writable } from 'svelte/store';

export function useUserSeason(showId: number) {
  if (!isAuthorized()) return writable(0);

  const { history } = useUser();

  return derived(history, ($history) => {
    if (!$history) return -1;

    const episodes = $history?.shows.get(showId)?.episodes ?? [{ season: 0 }];

    return Math.max(...episodes.map((episode) => episode.season));
  });
}
