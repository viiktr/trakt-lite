<script lang="ts">
  import MarkAsWatchedActionButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedActionButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import EpisodeCard from "$lib/components/episode/card/EpisodeCard.svelte";
  import MediaCover from "$lib/components/media/card/MediaCover.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { languageTag } from "$lib/features/i18n";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/models/EpisodeEntry";
  import type { MediaSummary } from "$lib/requests/models/MediaSummary";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { EPISODE_PLACEHOLDER } from "$lib/utils/constants";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";

  type EpisodeProps = {
    episode: EpisodeEntry;
    show: MediaSummary;
  };

  const { show, episode }: EpisodeProps = $props();

  const { isWatched, isMarkingAsWatched, markAsWatched, removeWatched } =
    $derived(
      useMarkAsWatched({
        type: "episode",
        media: episode,
        show,
        episode,
      }),
    );
</script>

<EpisodeCard>
  <MediaCover
    src={episode.poster.url ?? EPISODE_PLACEHOLDER}
    alt={`${episode.title} poster`}
  >
    {#snippet tags()}
      <DurationTag>
        {toHumanDuration({ minutes: episode.runtime }, languageTag())}
      </DurationTag>
    {/snippet}
  </MediaCover>

  <CardFooter>
    <p class="episode-title small ellipsis">
      {episode.title}
    </p>
    <p class="episode-subtitle small ellipsis">
      {episode.season}x{episode.number}
    </p>
    {#snippet actions()}
      <RenderFor audience="authenticated">
        <MarkAsWatchedActionButton
          title={episode.title}
          isWatched={$isWatched}
          isMarkingAsWatched={$isMarkingAsWatched}
          onWatch={markAsWatched}
          onRemove={removeWatched}
        />
      </RenderFor>
    {/snippet}
  </CardFooter>
</EpisodeCard>

<style>
  .episode-title {
    color: var(--color-text-primary);
    margin: 0;

    font-weight: 600;
  }

  .episode-subtitle {
    color: var(--color-text-secondary);
    margin: 0;

    font-weight: 500;
  }
</style>
