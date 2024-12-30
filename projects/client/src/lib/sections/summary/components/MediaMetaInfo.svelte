<script lang="ts">
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import type { ActiveWatcher } from "$lib/models/ActiveWatcher";
  import type { MediaRating } from "$lib/models/MediaRating";
  import type { MediaStats } from "$lib/models/MediaStats";
  import MediaMetaTags from "./MediaMetaTags.svelte";

  type MediaMetaInfoProps = {
    certification?: string | Nil;
    year: number | Nil;
    ratings: MediaRating;
    stats: MediaStats;
    watchers: ActiveWatcher[];
  };

  const { certification, year, ratings, stats, watchers }: MediaMetaInfoProps =
    $props();
</script>

<div class="trakt-media-meta">
  <RatingList {ratings} />
  <MediaMetaTags {certification} {year} {stats} {watchers} />
</div>

<style>
  .trakt-media-meta {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }
</style>
