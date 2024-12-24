<script lang="ts">
  import MarkAsWatchedIcon from "../../icons/MarkAsWatchedIcon.svelte";
  import Button from "../Button.svelte";
  import { attachRemoveWarning } from "./attachRemoveWarning";
  import { MarkAsWatchedButtonIntlProvider } from "./MarkAsWatchedButtonIntlProvider";
  import type { MarkAsWatchedButtonProps } from "./MarkAsWatchedButtonProps";

  const {
    i18n = MarkAsWatchedButtonIntlProvider,
    title,
    onWatch,
    onRemove,
    isMarkingAsWatched,
    isWatched,
    ...props
  }: MarkAsWatchedButtonProps = $props();

  const handler = $derived(
    isWatched
      ? attachRemoveWarning(onRemove, i18n.warning({ isWatched, title }))
      : onWatch,
  );
  const color = $derived(isWatched ? "red" : "purple");
</script>

<Button
  label={i18n.label({ title, isWatched })}
  {color}
  variant="secondary"
  onclick={handler}
  disabled={isMarkingAsWatched}
  {...props}
>
  {i18n.text({ title, isWatched })}
  {#snippet icon()}
    <MarkAsWatchedIcon
      state={isWatched ? "watched" : "unwatched"}
      size="small"
    />
  {/snippet}
</Button>
