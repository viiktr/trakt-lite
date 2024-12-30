<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { writable } from "svelte/store";
  import MarkAsWatchedIcon from "../../icons/MarkAsWatchedIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
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
    type,
    ...props
  }: MarkAsWatchedButtonProps = $props();

  const handler = $derived(
    isWatched
      ? attachRemoveWarning(onRemove, i18n.warning({ isWatched, title }))
      : onWatch,
  );

  const stateToColor = (isWatched: boolean) => (isWatched ? "red" : "purple");
  const interactionToColor = (isTouch: boolean, isWatched: boolean) =>
    isTouch ? stateToColor(isWatched) : "purple";
  /**
   * TODO: extact this logic as danger mode for buttons in general
   * we need to have something like mode="action" | "danger"
   */
  const isTouch = useMedia(WellKnownMediaQuery.touch);
  const color = $derived(
    writable<"purple" | "red">(interactionToColor($isTouch, isWatched)),
  );
  const variant = $derived(isWatched ? "primary" : "secondary");

  $effect(() => {
    color.set(interactionToColor($isTouch, isWatched));
  });

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ title, isWatched }),
    color: $color,
    variant,
    onclick: handler,
    disabled: isMarkingAsWatched,
    onmouseover: () => color.set(stateToColor(isWatched)),
    onfocusin: () => color.set(stateToColor(isWatched)),
    onfocusout: () => color.set(interactionToColor($isTouch, isWatched)),
    onmouseout: () => color.set(interactionToColor($isTouch, isWatched)),
  });
</script>

{#if type === "normal"}
  <Button {...commonProps} {...props}>
    {i18n.text({ title, isWatched })}
    {#snippet icon()}
      <MarkAsWatchedIcon
        state={isWatched ? "watched" : "unwatched"}
        size="small"
      />
    {/snippet}
  </Button>
{/if}

{#if type === "action"}
  <ActionButton {...commonProps} {...props}>
    <MarkAsWatchedIcon state={isWatched ? "watched" : "unwatched"} />
  </ActionButton>
{/if}
