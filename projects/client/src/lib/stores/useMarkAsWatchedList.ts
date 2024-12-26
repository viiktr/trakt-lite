import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import { resolveWatchDate } from '$lib/stores/_internal/resolveWatchDate.ts';
import { toMarkAsWatchedPayload } from '$lib/stores/_internal/toMarkAsWatchedPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { derived, writable } from 'svelte/store';

type BaseProps = {
  type: 'episode';
  media: { id: number }[];
};

type EpisodeProps = {
  type: 'episode';
  show: { id: number };
  episodes: {
    season: number;
    number: number;
  }[];
};

export type MarkAsWatchedListProps = BaseProps & EpisodeProps;

export function useMarkAsWatchedList(
  { media, type, show, episodes }: MarkAsWatchedListProps,
) {
  const { invalidate } = useInvalidator();
  const { current: user, history } = useUser();
  const isMarkingAsWatched = writable(false);

  const isWatched = derived(
    history,
    ($history) => {
      if (!$history) {
        return false;
      }

      switch (type) {
        case 'episode': {
          const watchedEpisodes = $history.shows.get(show.id)?.episodes ?? [];

          return episodes.every((episode) =>
            watchedEpisodes.some((e) =>
              e.season === episode.season && e.episode === episode.number
            )
          );
        }
      }
    },
  );

  const markAllAsWatched = async () => {
    const watchedAtDate = resolveWatchDate(
      user().preferences.watch.action,
    );

    isMarkingAsWatched.set(true);

    await markAsWatchedRequest({
      body: toMarkAsWatchedPayload(type, {
        ids: media.map(({ id }) => id),
        watchedAtDate,
      }),
    });
    isMarkingAsWatched.set(false);

    await invalidate(InvalidateAction.MarkAsWatched(type));
  };

  const removeAllWatched = async () => {
    isMarkingAsWatched.set(true);
    await removeWatchedRequest({
      body: toMarkAsWatchedPayload(type, {
        ids: media.map(({ id }) => id),
      }),
    });
    isMarkingAsWatched.set(false);

    await invalidate(InvalidateAction.MarkAsWatched(type));
  };

  return {
    markAllAsWatched,
    removeAllWatched,
    isMarkingAsWatched,
    isWatched,
  };
}
