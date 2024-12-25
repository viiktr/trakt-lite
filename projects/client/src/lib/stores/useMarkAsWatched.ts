import type { WatchAction } from '$lib/api.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import { derived, writable } from 'svelte/store';
import { toMarkAsWatchedPayload } from './_internal/toMarkAsWatchedPayload.ts';
import { useInvalidator } from './useInvalidator.ts';

export function resolveWatchDate(
  action: WatchAction | undefined,
) {
  const now = new Date().toISOString();

  switch (action) {
    case 'released':
      return 'released';
    case 'ask':
      return prompt(
        m.mark_as_watched_ask_prompt(),
        now,
      ) ?? undefined;
    case 'now':
    default:
      return now;
  }
}

type BaseProps = {
  type: MediaType | 'episode';
  media: { id: number };
};

type EpisodeProps = {
  type: 'episode';
  show: { id: number };
  episode: {
    season: number;
    number: number;
  };
};

type NonEpisodeProps = {
  type: 'movie' | 'show';
  media: { id: number };
};

type MarkAsWatchedStoreProps = BaseProps & (EpisodeProps | NonEpisodeProps);

export function useMarkAsWatched(
  props: MarkAsWatchedStoreProps,
) {
  const { type, media } = props;
  const isMarkingAsWatched = writable(false);
  const { history } = useUser();
  const { invalidate } = useInvalidator();

  /**
   *  TODO: implement some sort of in-memory cache for result of action response
   *  that will allow to show optimistic UI updates while history is being updated
   */
  const isWatched = derived(
    history,
    ($history) => {
      if (!$history) {
        return false;
      }

      switch (type) {
        case 'movie':
          return $history.movies.has(media.id);
        case 'episode':
          return !!$history.shows.get(props.show.id)
            ?.episodes.some((entry) =>
              entry.episode === props.episode.number &&
              entry.season === props.episode.season
            );
        case 'show': {
          return !!$history.shows.get(media.id)?.isWatched;
        }
      }
    },
  );

  const { current: user } = useUser();

  const markAsWatched = async () => {
    const watchedAtDate = resolveWatchDate(
      user().preferences.watch.action,
    );

    isMarkingAsWatched.set(true);
    await markAsWatchedRequest({
      body: toMarkAsWatchedPayload(type, {
        ids: [media.id],
        watchedAtDate,
      }),
    });
    isMarkingAsWatched.set(false);

    await invalidate(InvalidateAction.MarkAsWatched(type));
  };

  const removeWatched = async () => {
    isMarkingAsWatched.set(true);
    await removeWatchedRequest({
      body: toMarkAsWatchedPayload(type, {
        ids: [media.id],
      }),
    });
    isMarkingAsWatched.set(false);

    await invalidate(InvalidateAction.MarkAsWatched(type));
  };

  return {
    markAsWatched,
    removeWatched,
    isWatched,
    isMarkingAsWatched,
  };
}
