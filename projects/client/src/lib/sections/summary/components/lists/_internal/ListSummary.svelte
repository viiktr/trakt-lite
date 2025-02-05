<script lang="ts">
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import ListDetails from "./ListDetails.svelte";
  import ListPosters from "./ListPosters.svelte";

  const { list }: { list: MediaListSummary } = $props();
</script>

<div class="trakt-list-summary">
  <div class="trakt-posters-wrapper">
    <ListPosters {list} />
  </div>
  <div class="trakt-details-wrapper">
    <ListDetails {list} />
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-summary {
    display: flex;
    gap: var(--gap-s);

    border-radius: var(--border-radius-m);

    @include for-tablet-lg-and-below {
      flex-direction: column-reverse;
    }
  }

  .trakt-posters-wrapper {
    width: var(--ni-264);
    flex-shrink: 0;

    @include for-tablet-lg-and-below {
      width: 100%;
    }
  }

  .trakt-details-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    flex-grow: 1;
    padding: var(--ni-12);
  }
</style>
