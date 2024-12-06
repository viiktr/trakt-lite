import type { SortDirection, UpNextResponse } from '$lib/api.ts';
import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
import {
  type EpisodeType,
  EpisodeUnknownType,
} from '$lib/models/EpisodeType.ts';
import type { Paginatable } from '$lib/models/Paginatable.ts';
import type { ShowMeta } from '$lib/models/ShowMeta.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { EpisodeProgressEntry } from '../../../models/EpisodeProgressEntry.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';

export type UpNextEntry = EpisodeProgressEntry & {
  show: ShowMeta;
};

type UpNextParams = {
  page?: number;
  limit?: number;
  sort?: {
    by?: string;
    direction?: SortDirection;
  };
} & ApiParams;

function mapResponseToUpNextEntry(item: UpNextResponse[0]): UpNextEntry {
  const episode = item.progress.next_episode;

  const posterCandidate = episode.images!.screenshot.at(1) ??
    episode.images!.screenshot.at(0);

  const showCoverCandidate = item.show.images!.fanart.at(1) ??
    item.show.images!.fanart.at(0);

  return {
    show: {
      title: item.show.title,
      id: item.show.ids.trakt,
      slug: item.show.ids.slug,
      cover: {
        url: prependHttps(showCoverCandidate),
      },
    },
    title: episode.title,
    season: episode.season,
    number: episode.number,
    poster: {
      url: prependHttps(posterCandidate),
    },
    airedDate: new Date(episode.first_aired),
    id: episode.ids.trakt,
    total: item.progress.aired,
    completed: item.progress.completed,
    remaining: item.progress.aired - item.progress.completed,
    minutesLeft: item.progress.stats?.minutes_left ?? 0,
    type: episode.episode_type as EpisodeType ??
      EpisodeUnknownType.Unknown,
  };
}

export function upNextRequest(
  { fetch, page = 1, limit, sort }: UpNextParams = {},
): Promise<Paginatable<UpNextEntry>> {
  return api({ fetch })
    .sync
    .progress
    .upNext({
      query: {
        extended: 'full,cloud9',
        page,
        limit,
        sort_by: sort?.by,
        sort_how: sort?.direction,
        include_stats: true,
      },
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status, body, headers }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up next');
      }

      return {
        entries: body.map(mapResponseToUpNextEntry),
        page: extractPageMeta(headers),
      };
    });
}
export const upNextQueryKey = ['upNext'] as const;
export const upNextQuery = (
  params: UpNextParams = {},
) => ({
  queryKey: upNextQueryKey,
  queryFn: () => upNextRequest(params),
});
