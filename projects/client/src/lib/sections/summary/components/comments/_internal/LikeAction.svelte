<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LikeIcon from "$lib/components/icons/LikeIcon.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { usePermissions } from "$lib/stores/usePermissions";

  const { comment }: { comment: MediaComment } = $props();

  const { isPermitted } = usePermissions("comment");

  // TODO: get current user like & also disable when loading
  const isDisabled = $derived(!$isPermitted || undefined);
</script>

<!-- TODO intl -->
<!-- TODO: like/unlike label -->
<trakt-like-action>
  <Button href="" label="" style="ghost" color="purple" disabled={isDisabled}>
    {#snippet icon()}
      <LikeIcon />
    {/snippet}
    {comment.likeCount} likes
  </Button>
</trakt-like-action>

<style>
  trakt-like-action {
    /* To align the button icon instead of the ghost border */
    margin-left: var(--ni-neg-16);

    :global(.trakt-button) {
      display: flex;
      flex-direction: row-reverse;
    }
  }
</style>
