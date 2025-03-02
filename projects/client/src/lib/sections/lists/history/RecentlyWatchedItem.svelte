<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import ActivityCard from "../components/ActivityCard.svelte";
  import ActivitySummaryCard from "../components/ActivitySummaryCard.svelte";
  import type { HistoryEntry } from "../stores/useRecentlyWatchedList";

  type RecentlyWatchedItemProps = {
    media: HistoryEntry;
    style?: "summary" | "cover";
  };

  const { media: activity, style = "cover" }: RecentlyWatchedItemProps =
    $props();
</script>

{#snippet popupActions()}
  <RenderFor audience="authenticated">
    {#if activity.type === "episode"}
      <MarkAsWatchedAction
        style="dropdown-item"
        type={activity.type}
        title={activity.episode.title}
        show={activity.show}
        episode={activity.episode}
        media={activity.episode}
      />
    {:else}
      <MarkAsWatchedAction
        style="dropdown-item"
        type={activity.type}
        title={activity.movie.title}
        media={activity.movie}
      />
    {/if}
  </RenderFor>
{/snippet}

{#snippet badges()}
  {#if activity.type === "episode"}
    <EpisodeStatusTag i18n={EpisodeIntlProvider} type={activity.episode.type} />
  {/if}
{/snippet}

{#if style === "cover"}
  <ActivityCard activityAt={activity.watchedAt} {activity} {popupActions} />
{/if}

{#if style === "summary"}
  <ActivitySummaryCard
    activityAt={activity.watchedAt}
    {activity}
    {badges}
    {popupActions}
  />
{/if}
