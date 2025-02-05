<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { useList } from "./useList";

  const MAX_POSTER_COUNT = 5;

  const { list }: { list: MediaListSummary } = $props();

  const { items } = useList(list.id);

  const topItems = $derived($items?.slice(0, MAX_POSTER_COUNT));
</script>

{#if topItems}
  <div class="trakt-list-posters" style="--poster-count: {topItems.length}">
    {#each topItems as item, index}
      <div class="poster-wrapper" style="--poster-index: {index}">
        <CrossOriginImage
          animate={false}
          src={item.entry.poster.url.medium}
          alt={`${item.entry.title} poster`}
        />
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-posters {
    --poster-width: var(--ni-120);
    --poster-height: var(--ni-180);

    height: var(--poster-height);
    width: 100%;

    display: flex;
    flex-shrink: 0;

    position: relative;

    counter-reset: number;
  }

  .poster-wrapper {
    --poster-index: 0;

    position: absolute;
    left: calc(
      (100% - var(--poster-width)) / (var(--poster-count) - 1) *
        var(--poster-index)
    );

    height: var(--poster-height);
    width: var(--poster-width);

    box-shadow: -16px 0px 16px 0px rgba(0, 0, 0, 0.56);
    border-radius: var(--border-radius-m);
    overflow: hidden;

    :global(img) {
      width: 100%;
      height: 100%;
    }
  }
</style>
