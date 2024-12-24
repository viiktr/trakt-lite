<script lang="ts">
  import MarkAsWatchedIcon from "../../icons/MarkAsWatchedIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
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

<ActionButton
  {color}
  label={i18n.label({ title, isWatched })}
  onclick={handler}
  disabled={isMarkingAsWatched}
  {...props}
>
  <MarkAsWatchedIcon state={isWatched ? "watched" : "unwatched"} />
</ActionButton>
