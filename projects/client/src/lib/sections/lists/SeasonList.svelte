<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import MarkAsWatchedActionButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import ShadowList from "$lib/components/section-list/ShadowList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { Season } from "$lib/models/Season";
  import type { MediaSummary } from "$lib/requests/models/MediaSummary";
  import { useMarkAsWatchedList } from "$lib/stores/useMarkAsWatchedList";
  import { writable } from "svelte/store";
  import EpisodeItem from "./components/EpisodeItem.svelte";
  import { useSeasonEpisodes } from "./stores/useSeasonEpisodes";
  import { useUserSeason } from "./stores/useUserSeason";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type SeasonListProps = {
    show: MediaSummary;
    seasons: Season[];
  };

  const { show, seasons }: SeasonListProps = $props();

  const season = useUserSeason(show.id);
  const active = writable(seasons.at(0));
  const { list } = $derived(useSeasonEpisodes(show.slug, $active.number));

  const title = $derived(m.season_number_label({ number: $active.number }));

  const { markAllAsWatched, removeAllWatched, isMarkingAsWatched, isWatched } =
    $derived(
      useMarkAsWatchedList({
        type: "episode",
        media: $list,
        episodes: $list,
        show,
      }),
    );

  const seasonUnsubscribe = season.subscribe((seasonNumber) => {
    const season = seasons.find((s) => s.number === seasonNumber);

    if (season) {
      active.set(season);
    }

    if (seasonNumber !== -1) {
      queueMicrotask(() => seasonUnsubscribe());
    }
  });
</script>

<ShadowList
  id={`season-list-${show.slug}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver("episode")}
>
  {#snippet item(episode)}
    <EpisodeItem {episode} {show} />
  {/snippet}
  {#snippet actions()}
    <RenderFor audience="authenticated">
      <MarkAsWatchedActionButton
        isWatched={$isWatched}
        isMarkingAsWatched={$isMarkingAsWatched}
        title={m.season_number_label({ number: $active.number })}
        onWatch={() => markAllAsWatched()}
        onRemove={() => removeAllWatched()}
      />
    </RenderFor>
    <DropdownList
      label="Seasons"
      style="flat"
      variant="primary"
      color="blue"
      text="capitalize"
      size="small"
    >
      {title}
      {#snippet items()}
        {#each seasons as season}
          <DropdownItem color="blue" onclick={() => active.set(season)}>
            {m.season_number_label({ number: season.number })}
          </DropdownItem>
        {/each}
      {/snippet}
    </DropdownList>
  {/snippet}
</ShadowList>

<style>
  :global(.shadow-list-container) {
    :global(.trakt-dropdown-list-container[data-size="small"]) {
      margin-right: var(--ni-neg-36);
    }
  }
</style>
