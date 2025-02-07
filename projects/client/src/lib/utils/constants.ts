import { assets } from '$app/paths';
import { shuffle } from '$lib/utils/array/shuffle.ts';
import { assertDefined } from './assert/assertDefined.ts';

/**
 * This cover is the Alien Isolation cover.
 */
export const DEFAULT_COVER =
  'https://walter-r2.trakt.tv/images/movies/000/759/944/fanarts/full/a12a59d031.jpg.webp';

export const EPISODE_COVER_PLACEHOLDER =
  `${assets}/placeholders/landscape_placeholder.png` as HttpsUrl;

export const MEDIA_COVER_LARGE_PLACEHOLDER =
  `${assets}/placeholders/purple_placeholder.png` as HttpsUrl;

export const MEDIA_COVER_THUMB_PLACEHOLDER =
  `${assets}/placeholders/landscape_placeholder.png` as HttpsUrl;

export const MEDIA_POSTER_PLACEHOLDER =
  `${assets}/placeholders/portrait_placeholder.png` as HttpsUrl;

export const DEFAULT_TRAILER = 'https://www.youtube.com/watch?v=o-YBDTqX_ZU';

export const DEFAULT_AVATAR =
  `https://walter-r2.trakt.tv/hotlink-ok/placeholders/medium/zoidberg.png` as HttpsUrl;

export const MAX_DATE = new Date('9999-12-31T23:59:59.999Z');
export const MIN_DATE = new Date('0000-01-01T00:00:00.000Z');

const generateShareCover = (type: 'show' | 'movie') =>
  assertDefined(
    shuffle(
      [1, 2, 3, 4, 5].map((n) => `${assets}/trakt_share_${type}_${n}.webp`),
    ).at(0),
    `${type} share cover is required`,
  );

export const DEFAULT_SHARE_SHOW_COVER = generateShareCover('show');
export const DEFAULT_SHARE_MOVIE_COVER = generateShareCover('movie');

export const DEFAULT_SHARE_COVER = assertDefined(
  shuffle([
    DEFAULT_SHARE_SHOW_COVER,
    DEFAULT_SHARE_MOVIE_COVER,
  ]).at(0),
  'Default share cover is required',
);

export const NOOP_FN = () => {
  // noop
};

export const DEFAULT_PAGE_SIZE = 15;
export const DEFAULT_DRILL_SIZE = 100;
export const RECOMMENDED_UPPER_LIMIT = 100;
export const PAGE_UPPER_LIMIT = 3;
