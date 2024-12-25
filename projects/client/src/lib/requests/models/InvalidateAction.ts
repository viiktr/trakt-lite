import type { MediaType } from '$lib/models/MediaType.ts';

type ExtendedMediaType = MediaType | 'episode';

export type InvalidateActionOptions =
  | `invalidate:mark_as_watched:${ExtendedMediaType}`
  | 'invalidate:auth'
  | `invalidate:watchlisted:${ExtendedMediaType}`;

export const InvalidateAction = {
  MarkAsWatched: (type: ExtendedMediaType): InvalidateActionOptions =>
    `invalidate:mark_as_watched:${type}` as InvalidateActionOptions,
  Watchlisted: (type: ExtendedMediaType): InvalidateActionOptions =>
    `invalidate:watchlisted:${type}`,
  Auth: 'invalidate:auth' as InvalidateActionOptions,
};
