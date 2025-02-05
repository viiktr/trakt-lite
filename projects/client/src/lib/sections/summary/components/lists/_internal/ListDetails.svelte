<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { list }: { list: MediaListSummary } = $props();
</script>

<div class="trakt-list-details">
  <div class="list-creator-avatar">
    <CrossOriginImage
      src={list.user.avatar.url}
      alt={`${list.user.userName}'s avatar`}
    />
  </div>
  <div>
    <p class="secondary bold">{list.name}</p>
    <p class="secondary small list-creator">
      by
      <Link href={UrlBuilder.og.user(list.user.slug)} target="_blank">
        {list.user.userName}
      </Link>
    </p>
  </div>
</div>

<style>
  .trakt-list-details {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);
  }

  .list-creator-avatar {
    width: var(--ni-36);
    height: var(--ni-36);
    flex-shrink: 0;

    :global(img) {
      border-radius: 50%;
      box-sizing: border-box;

      width: 100%;
      height: 100%;
    }
  }

  .list-creator {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    :global(a) {
      color: var(--shade-10);
      font-weight: 700;
    }
  }
</style>
