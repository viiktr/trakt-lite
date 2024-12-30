<script lang="ts">
  import CertificationTag from "$lib/components/media/tags/CertificationTag.svelte";
  import PlaysTag from "$lib/components/media/tags/PlaysTag.svelte";
  import WatchingTag from "$lib/components/media/tags/WatchingTag.svelte";
  import YearTag from "$lib/components/media/tags/YearTag.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { ActiveWatcher } from "$lib/models/ActiveWatcher";
  import type { MediaStats } from "$lib/models/MediaStats";
  import { languageTag } from "$lib/paraglide/runtime";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import type { MediaSummary } from "./MediaSummary";

  type MediaMetaTagsProps = {
    media: MediaSummary;
    watchers: ActiveWatcher[];
    stats: MediaStats;
  };

  const { media, stats, watchers }: MediaMetaTagsProps = $props();
</script>

<div class="trakt-meta-tags">
  {#if media.certification}
    <CertificationTag>
      {media.certification}
    </CertificationTag>
  {/if}

  {#if media.year}
    <YearTag>
      {media.year}
    </YearTag>
  {/if}

  <WatchingTag>
    {m.active_watchers({ count: watchers.length })}
  </WatchingTag>

  <PlaysTag>
    {toHumanNumber(stats.plays, languageTag())}
    {m.plays()}
  </PlaysTag>
</div>

<style>
  .trakt-meta-tags {
    display: flex;
    gap: var(--ni-8);
  }
</style>
