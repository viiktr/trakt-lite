import { assets } from '$app/paths';
import { shuffle } from '$lib/utils/array/shuffle.ts';

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

export const MAX_DATE = new Date('9999-12-31T23:59:59.999Z');
export const MIN_DATE = new Date('0000-01-01T00:00:00.000Z');

export const DEFAULT_SHARE_SHOW_COVER = shuffle([
  `${assets}/trakt_share_show_1.webp`,
  `${assets}/trakt_share_show_2.webp`,
  `${assets}/trakt_share_show_3.webp`,
  `${assets}/trakt_share_show_4.webp`,
  `${assets}/trakt_share_show_5.webp`,
]).at(0)!;

export const DEFAULT_SHARE_MOVIE_COVER = shuffle([
  `${assets}/trakt_share_movie_1.webp`,
  `${assets}/trakt_share_movie_2.webp`,
  `${assets}/trakt_share_movie_3.webp`,
  `${assets}/trakt_share_movie_4.webp`,
  `${assets}/trakt_share_movie_5.webp`,
]).at(0)!;

export const DEFAULT_SHARE_COVER = shuffle([
  DEFAULT_SHARE_SHOW_COVER,
  DEFAULT_SHARE_MOVIE_COVER,
]).at(0)!;
