<script lang="ts">
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import LikeAction from "./LikeAction.svelte";

  const { comment }: { comment: MediaComment } = $props();
</script>

<div class="trakt-comment-footer">
  <div class="trakt-comment-likes">
    <LikeAction {comment} />
  </div>
</div>

<style>
  .trakt-comment-footer {
    height: var(--ni-40);
  }

  .trakt-comment-likes {
    display: flex;
    align-items: center;
    gap: var(--ni-2);
  }
</style>
