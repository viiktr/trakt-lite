<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import WatchlistIcon from "$lib/components/icons/WatchlistIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
  import { WatchlistButtonIntlProvider } from "./WatchlistButtonIntlProvider";
  import type { WatchlistButtonProps } from "./WatchlistButtonProps";

  const {
    i18n = WatchlistButtonIntlProvider,
    title,
    isWatchlistUpdating,
    isWatchlisted,
    type,
    onAdd,
    onRemove,
    ...props
  }: WatchlistButtonProps = $props();

  const handler = $derived(isWatchlisted ? onRemove : onAdd);
  const state = $derived(isWatchlisted ? "added" : "missing");
  const variant = $derived(isWatchlisted ? "primary" : "secondary");

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ isWatchlisted, title }),
    color: "blue",
    variant,
    onclick: handler,
    disabled: isWatchlistUpdating,
  });
</script>

{#if type === "normal"}
  <Button {...commonProps} {...props}>
    {i18n.text({ isWatchlisted, title })}
    {#snippet icon()}
      <WatchlistIcon size="small" {state} />
    {/snippet}
  </Button>
{/if}

{#if type === "action"}
  <ActionButton {...commonProps} {...props}>
    <WatchlistIcon {state} />
  </ActionButton>
{/if}
