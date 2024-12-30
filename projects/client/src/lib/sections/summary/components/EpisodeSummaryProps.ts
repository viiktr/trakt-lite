import type { ActiveWatcher } from '$lib/models/ActiveWatcher';
import type { EpisodeEntry } from '$lib/models/EpisodeEntry';
import type { EpisodeIntl } from '$lib/models/EpisodeIntl';
import type { MediaRating } from '$lib/models/MediaRating';
import type { MediaStats } from '$lib/models/MediaStats';
import type { Season } from '$lib/models/Season';
import type { MediaSummary } from '$lib/requests/models/MediaSummary';
import type { Snippet } from 'svelte';

export type EpisodeSummaryProps = {
  episode: EpisodeEntry;
  show: MediaSummary;
  seasons: Season[];
  ratings: MediaRating;
  watchers: ActiveWatcher[];
  stats: MediaStats;
  intl: EpisodeIntl;
  actions?: Snippet;
};
