<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import GenreList from "$lib/components/summary/GenreList.svelte";
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { writable } from "svelte/store";
  import MediaMetaInfo from "./MediaMetaInfo.svelte";
  import type { MediaSummary } from "./MediaSummary";
  import type { MediaSummaryProps } from "./MediaSummaryProps";

  const {
    media,
    ratings,
    watchers,
    stats,
    intl,
    actions,
  }: MediaSummaryProps<MediaSummary> = $props();
  const isLargeDisplay = useMedia(WellKnownMediaQuery.desktop);
  const genreCount = $derived($isLargeDisplay ? undefined : 3);
  const isClamped = writable(false);
  const lines = writable(3);
</script>

<div class="trakt-summary-header">
  <h3
    class:short-title={media.title.length < 15}
    class:long-title={media.title.length > 25}
  >
    {intl.title}
  </h3>
  <GenreList genres={media.genres.slice(0, genreCount)} />
</div>

<MediaMetaInfo {media} {ratings} {stats} {watchers} />

<ClampedText
  classList="trakt-media-overview secondary"
  label={m.expand_media_overview({ title: media.title })}
>
  {intl.overview}
</ClampedText>

<div class="trakt-info-actions">
  {@render actions?.()}
</div>

<style>
  .trakt-summary-header {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  :global(.trakt-media-overview) {
    line-height: 150%;
  }

  .trakt-info-actions {
    display: flex;
    gap: var(--ni-8);
  }

  h3 {
    --text-size: 7cqi;

    &.short-title {
      --text-size: 10cqi;
    }

    &.long-title {
      --text-size: 2.5cqi;
    }

    font-size: clamp(var(--ni-24), var(--text-size), var(--ni-48));
  }
</style>
