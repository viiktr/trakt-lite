<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import type { CardCoverProps } from "$lib/components/card/CardCoverProps";

  const {
    src,
    alt,
    tags: posterTags,
    isLoading,
    isGrayscale,
  }: CardCoverProps = $props();
</script>

<CardCover {src} {alt} {isLoading} {isGrayscale}>
  {#snippet tags()}
    {@render posterTags?.()}
  {/snippet}
</CardCover>
