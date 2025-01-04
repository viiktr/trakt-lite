<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import ActionButton from "../ActionButton.svelte";

  const { title } = $props();
  const url = window.location.href;

  const data = $derived({
    title,
    text: m.where_to_watch_on_trakt({ title }),
    url,
  });

  const isShareable = $derived(
    !!navigator.canShare && navigator.canShare(data),
  );

  const share = async () => {
    if (!isShareable) {
      return;
    }

    await navigator.share(data);
  };
</script>

{#if isShareable}
  <ActionButton
    label={m.share_title({ title })}
    size="small"
    variant="secondary"
    onclick={share}
  >
    <ShareIcon />
  </ActionButton>
{/if}
