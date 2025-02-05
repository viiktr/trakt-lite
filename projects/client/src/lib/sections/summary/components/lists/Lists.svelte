<script lang="ts">
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import SummaryContainer from "../summary/SummaryContainer.svelte";
  import ListSummary from "./_internal/ListSummary.svelte";

  const MAX_LISTS = 3;
  const { lists }: { lists: MediaListSummary[] } = $props();

  const topLists = $derived(lists.slice(0, MAX_LISTS));
</script>

<SummaryContainer>
  <div class="trakt-media-lists">
    <h5>Lists</h5>
    {#each topLists as list}
      <ListSummary {list} />
    {/each}
  </div>
</SummaryContainer>

<style>
  .trakt-media-lists {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>
